from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3, hashlib, os, time, secrets
from pydantic import BaseModel, Field
from typing import Literal, Any
from datetime import datetime
from pathlib import Path

app = FastAPI()
database:str = 'main.db'
static:str = 'static/icons'

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:3000', '*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
app.mount('/static', StaticFiles(directory='static'), name='static')

def ConnectDb():
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    return conn

def InitDb():
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
            uid INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT UNIQUE NOT NULL, 
            password TEXT NOT NULL, 
            email TEXT NOT NULL, 
            role TEXT NOT NULL, 
            status TEXT DEFAULT 'Active', 
            profilePicture TEXT)''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
            primarySid TEXT PRIMARY KEY, 
            altSid TEXT, 
            uid INTEGER UNIQUE, 
            expireTime FLOAT)''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS categories (
            cid INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT UNIQUE NOT NULL, 
            color TEXT NOT NULL, 
            priorityScore INTEGER DEFAULT 0, 
            icon TEXT)''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS locations (
            lid INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT UNIQUE NOT NULL, 
            priorityScore INTEGER DEFAULT 0)''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tickets (
            ticketId INTEGER PRIMARY KEY AUTOINCREMENT, 
            submitterUid INTEGER NOT NULL, 
            assignedUid INTEGER, 
            title TEXT NOT NULL, 
            description TEXT NOT NULL, 
            status TEXT NOT NULL DEFAULT 'Open', 
            cid INTEGER, 
            lid INTEGER, 
            createdAt FLOAT, 
            updatedAt FLOAT, 
            deleted INTEGER DEFAULT 0, 
            FOREIGN KEY (submitterUid) REFERENCES users(uid), 
            FOREIGN KEY (assignedUid) REFERENCES users(uid), 
            FOREIGN KEY (cid) REFERENCES categories(cid), 
            FOREIGN KEY (lid) REFERENCES locations(lid))''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS comments (
            commentId INTEGER PRIMARY KEY AUTOINCREMENT, 
            ticketId INTEGER NOT NULL, 
            uid INTEGER NOT NULL, 
            content TEXT NOT NULL, 
            createdAt FLOAT, 
            FOREIGN KEY (ticketId) REFERENCES tickets(ticketId), 
            FOREIGN KEY (uid) REFERENCES users(uid))''')
        conn.commit()
    return None
InitDb()

def AuthCheck(data:Any, validation:list[str] = ['user', 'staff', 'admin']) -> dict[str, Any]:
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT uid, role 
            FROM users 
            WHERE uid = ?''', (data.requestId,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized request!")
        elif not user['role'] in validation:
            raise HTTPException(status_code=403, detail="The server has refused your request.")
        return dict(user)

def GenSid(uid:int, conn):
    cursor = conn.cursor()
    primarySid:str = secrets.token_hex(32)
    expireTime:float = time.time() + 900.0
    cursor.execute('''
        INSERT INTO sessions (primarySid, altSid, uid, expireTime) 
        VALUES (?, ?, ?, ?)''', (primarySid, '', uid, expireTime))
    print("Session token successfully generated.")
    return primarySid

class FetchStats(BaseModel):
    requestId:int
@app.post('/api/stats', status_code=200)
def GetStats(data:FetchStats):
    AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT COUNT(*) 
            FROM tickets 
            WHERE deleted = 0''')
        totalTickets:int = cursor.fetchone()[0]
        cursor.execute('''
            SELECT COUNT(*) 
            FROM users''')
        totalUsers:int = cursor.fetchone()[0]
        cursor.execute('''
            SELECT COUNT(*) 
            FROM categories''')
        totalCategories:int = cursor.fetchone()[0]
        cursor.execute('''
            SELECT COUNT(*) 
            FROM locations''')
        totalLocations:int = cursor.fetchone()[0]
    return {'totalTickets': totalTickets, 'totalUsers': totalUsers, 'totalCategories': totalCategories, 'totalLocations': totalLocations}

class SearchAll(BaseModel):
    requestId:int
    query:str
    searchMode:str | None = None
@app.post('/api/search', status_code=200)
def ExecuteSearch(data:SearchAll):
    user = AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        if data.searchMode == 'category' and user['role'] == 'admin':
            cursor.execute('''
                SELECT cid, name, color 
                FROM categories 
                WHERE name LIKE ?''', (f'%{data.query}%',))
            searchOutput:list = cursor.fetchall()
        else:
            cursor.execute(f'''
                SELECT ticketId, title 
                FROM tickets 
                WHERE title LIKE ?{' AND deleted = 0' if not user['role'] == 'admin' else ''}''', (f'%{data.query}%',))
            searchOutput:list = cursor.fetchall()
        return [dict(searchRow) for searchRow in searchOutput]

class FetchOneTicket(BaseModel):
    ticketId:int
    requestId:int
    allowOpen:str | None = None
@app.post('/api/ticket-{id}/view', status_code=200)
def GetTicket(data:FetchOneTicket):
    user = AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute(f'''
            SELECT t.ticketId, sub.username AS submitterUid, assign.username AS assignedUid, t.title, t.description, t.status, c.name AS categoryName, l.name AS locationName, (IFNULL(c.priorityScore, 0) + IFNULL(l.priorityScore, 0)) AS priorityScore, t.createdAt, t.updatedAt
            FROM tickets t LEFT JOIN categories c ON t.cid = c.cid LEFT JOIN locations l ON t.lid = l.lid LEFT JOIN users sub ON t.submitterUid = sub.uid LEFT JOIN users assign ON t.assignedUid = assign.uid
            WHERE t.ticketId = ?{' AND t.deleted = 0' if not user['role'] == 'admin' else ''}''', (data.ticketId,))
        ticketRow = cursor.fetchone()
    if not ticketRow:
        raise HTTPException(status_code=404, detail="Ticket not found!")
    elif data.allowOpen and not (ticketRow['submitterUid'] == data.requestId or ticketRow['assignedUid'] == data.requestId or user['role'] == 'admin'):
        raise HTTPException(status_code=403, detail="Access denied!")
    ticket = dict(ticketRow)
    if ticket['createdAt']:
        ticket['createdAt'] = datetime.fromtimestamp(ticket['createdAt']).strftime('%d %m %Y | %H:%M:%S')
    if ticket['updatedAt']:
        ticket['updatedAt'] = datetime.fromtimestamp(ticket['updatedAt']).strftime('%d %m %Y | %H:%M:%S')
    return ticket

@app.post('/api/ticket-{id}/delete', status_code=200)
def DeleteTicket(data:FetchOneTicket):
    user = AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT ticketId, submitterUid FROM tickets 
            WHERE ticketId = ? AND deleted = 0''', (data.ticketId,))
        ticketRow = cursor.fetchone()
        if not ticketRow:
            raise HTTPException(status_code=404, detail="Ticket not found!")
        if not (ticketRow['submitterUid'] == data.requestId or user['role'] == 'admin'):
            raise HTTPException(status_code=403, detail="Access denied!")
        cursor.execute('''
            UPDATE tickets SET deleted = 1 
            WHERE ticketId = ?''', (data.ticketId,))
    return {'status': 'success', 'message': "Deleted ticket successfully."}

class UpdateTickets(BaseModel):
    ticketId: int
    requestId: int
    targetUsername: str | None = None
    title: str | None = Field(None, min_length=3, max_length=100)
    description: str | None = Field(None, max_length=500)
    categoryName: str | None = None
    locationName: str | None = None
    status: str | None = None
    assignedUsername: str | None = None
    submitterUsername: str | None = None
    deleted: bool | None = None
@app.post('/api/ticket-{id}/update', status_code=200)
def UpdateTicket(data: UpdateTickets):
    print(data)
    user = AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        resolvedSubmitterUid: int | None = None
        if data.submitterUsername:
            cursor.execute('SELECT uid FROM users WHERE username = ?', (data.submitterUsername,))
            subRow = cursor.fetchone()
            if not subRow:
                raise HTTPException(status_code=404, detail=f"Submitter user '{data.submitterUsername}' not found!")
            resolvedSubmitterUid = subRow['uid']
        resolvedAssignedUid: int | None = None
        if data.assignedUsername:
            cursor.execute('SELECT uid FROM users WHERE username = ?', (data.assignedUsername,))
            assignRow = cursor.fetchone()
            if not assignRow:
                raise HTTPException(status_code=404, detail=f"Assigned user '{data.assignedUsername}' not found!")
            resolvedAssignedUid = assignRow['uid']
        resolvedTargetUid: int | None = None
        if data.targetUsername:
            cursor.execute('SELECT uid FROM users WHERE username = ?', (data.targetUsername,))
            targetRow = cursor.fetchone()
            if not targetRow:
                raise HTTPException(status_code=404, detail=f"Target user '{data.targetUsername}' not found!")
            resolvedTargetUid = targetRow['uid']
        resolvedCid: int | None = None
        if data.categoryName:
            cursor.execute('SELECT cid FROM categories WHERE name = ?', (data.categoryName,))
            catRow = cursor.fetchone()
            if not catRow:
                raise HTTPException(status_code=404, detail=f"Category '{data.categoryName}' not found!")
            resolvedCid = catRow['cid']
        resolvedLid: int | None = None
        if data.locationName:
            cursor.execute('SELECT lid FROM locations WHERE name = ?', (data.locationName,))
            locRow = cursor.fetchone()
            if not locRow:
                raise HTTPException(status_code=404, detail=f"Location '{data.locationName}' not found!")
            resolvedLid = locRow['lid']
        deleteFilter: str = '' if user['role'] == 'admin' else ' AND deleted = 0'
        cursor.execute(f'''
            SELECT ticketId, submitterUid, assignedUid, status, cid, lid 
            FROM tickets 
            WHERE ticketId = ?{deleteFilter}''', (data.ticketId,))
        ticketRow = cursor.fetchone()
        if not ticketRow:
            raise HTTPException(status_code=404, detail="Ticket not found!")
        elif not (ticketRow['submitterUid'] == data.requestId or ticketRow['assignedUid'] == data.requestId or ticketRow['assignedUid'] == None or user['role'] == 'admin'):
            raise HTTPException(status_code=403, detail="Access denied!")
        currentTime: float = time.time()
        finalCid: int = resolvedCid if resolvedCid is not None else ticketRow['cid']
        finalLid: int = resolvedLid if resolvedLid is not None else ticketRow['lid']
        if (ticketRow['submitterUid'] == data.requestId or user['role'] == 'admin'):
            cursor.execute('''
                UPDATE tickets 
                SET title = ?, description = ?, cid = ?, lid = ?, updatedAt = ? 
                WHERE ticketId = ? AND deleted = 0''', (data.title, data.description, finalCid, finalLid, currentTime, data.ticketId))                
        if ticketRow['assignedUid'] == data.requestId or ticketRow['assignedUid'] == None and user['role'] == 'staff':
            cursor.execute('''SELECT ticketId FROM tickets WHERE assignedUid = ? AND status != 'Closed' AND deleted = 0''', (data.requestId,))
            checkRow = cursor.fetchone()
            if checkRow and ticketRow['status'] == 'Open' and user['role'] != 'admin':
                raise HTTPException(status_code=409, detail="Please close your existing ticket before accepting a new ticket!")
            elif data.status == 'Open' and user['role'] != 'admin':
                raise HTTPException(status_code=400, detail="Status cannot be empty!")
            elif ticketRow['status'] == 'Closed' and checkRow and user['role'] != 'admin':
                raise HTTPException(status_code=400, detail="Please close your existing ticket before changing a ticket!")            
            cursor.execute('''
                UPDATE tickets 
                SET status = ?, assignedUid = ?, updatedAt = ? 
                WHERE ticketId = ? AND deleted = 0''', (data.status, data.requestId, currentTime, data.ticketId))                
        if user['role'] == 'admin':
            if not data.deleted:
                data.deleted = False
            newSubmitterUid: int = resolvedTargetUid if resolvedTargetUid is not None else (resolvedSubmitterUid if resolvedSubmitterUid is not None else ticketRow['submitterUid'])
            finalAssignedUid: int | None = resolvedAssignedUid if resolvedAssignedUid is not None else ticketRow['assignedUid']            
            cursor.execute('''
                UPDATE tickets 
                SET submitterUid = ?, title = ?, description = ?, cid = ?, lid = ?, status = ?, assignedUid = ?, updatedAt = ?, deleted = ? 
                WHERE ticketId = ?''', (newSubmitterUid, data.title, data.description, finalCid, finalLid, data.status, finalAssignedUid, currentTime, int(data.deleted), data.ticketId))            
    return {'status': 'success', 'message': "Ticket updated successfully."}

class FetchAllTickets(BaseModel):
    requestId:int
    allowOpen:str | None = None
@app.post('/api/tickets', status_code=200)
def AllTickets(data:FetchAllTickets):
    user = AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        baseQuery:str = '''
            SELECT t.ticketId, sub.username AS submitterUid, assign.username AS assignedUid, t.title, t.description, t.status, c.name AS categoryName, l.name AS locationName, (IFNULL(c.priorityScore, 0) + IFNULL(l.priorityScore, 0)) AS priorityScore, t.createdAt, t.updatedAt 
            FROM tickets t LEFT JOIN categories c ON t.cid = c.cid LEFT JOIN locations l ON t.lid = l.lid LEFT JOIN users sub ON t.submitterUid = sub.uid LEFT JOIN users assign ON t.assignedUid = assign.uid'''
        if user['role'] == 'admin':
            cursor.execute(f'''{baseQuery} ORDER BY t.status ASC, t.ticketId DESC''')
        elif user['role'] == 'staff' and data.allowOpen:
            cursor.execute(f'''{baseQuery} WHERE (t.status = 'Open' OR t.assignedUid = ?) AND t.deleted = 0 ORDER BY priorityScore DESC, t.ticketId DESC''', (data.requestId,))
        else:
            cursor.execute(f'''{baseQuery} WHERE (t.submitterUid = ? OR t.assignedUid = ?) AND t.deleted = 0 ORDER BY t.status ASC, t.ticketId DESC''', (data.requestId, data.requestId))
        ticketsList:list = cursor.fetchall()    
    formattedTickets:list = []
    for ticketRow in ticketsList:
        ticket = dict(ticketRow)
        if ticket['createdAt']:
            ticket['createdAt'] = datetime.fromtimestamp(ticket['createdAt']).strftime('%d %m %Y | %H:%M:%S')
        if ticket['updatedAt']:
            ticket['updatedAt'] = datetime.fromtimestamp(ticket['updatedAt']).strftime('%d %m %Y | %H:%M:%S')
        formattedTickets.append(ticket)  
    return formattedTickets

class MakeTicket(BaseModel):
    requestId:int
    title:str = Field(..., min_length=3, max_length=50)
    description:str = Field(..., max_length=100)
    cid:int
    lid:int
@app.post('/api/ticket/create', status_code=201)
def CreateTicket(data:MakeTicket):
    AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        currentTime:float = time.time()
        cursor.execute('''
            INSERT INTO tickets (submitterUid, assignedUid, title, description, status, cid, lid, createdAt, updatedAt, deleted) 
            VALUES (?, NULL, ?, ?, 'Open', ?, ?, ?, ?, 0)''', (data.requestId, data.title, data.description, data.cid, data.lid, currentTime, currentTime))
        conn.commit()
    return {'status': 'success', 'message': "Ticket created successfully."}

class FetchAllUsers(BaseModel):
    requestId:int
@app.post('/api/users', status_code=200)
def AllUsers(data:FetchAllUsers):
    AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT uid, username, email, role, status, profilePicture 
            FROM users ORDER BY uid ASC''')
        usersList:list = cursor.fetchall()
    return [dict(userRow) for userRow in usersList]

class FetchOneCategory(BaseModel):
    requestId:int
    cid:int
@app.post('/api/category/view', status_code=200)
def GetCategory(data:FetchOneCategory):
    AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT cid, name, color, priorityScore, icon 
            FROM categories 
            WHERE cid = ?''', (data.cid,))
        categoryRow = cursor.fetchone()
        if not categoryRow:
            raise HTTPException(status_code=404, detail="Category not found!")
        return dict(categoryRow)

@app.post('/api/category/delete', status_code=200)
def DeleteCategory(data:FetchOneCategory):
    AuthCheck(data, ['admin'])
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM categories 
            WHERE cid = ?''', (data.cid,))
        conn.commit()
    return {'status': 'success', 'message': "Category deleted successfully."}

class UpdateCategory:
    def __init__(self, requestId: int = Form(), cid: int = Form(), name: str = Form(), color: str = Form(..., min_length=3, max_length=7), priorityScore: int = Form(), icon: UploadFile | None = File(None)):
        self.requestId: int = requestId
        self.cid: int = cid
        self.name: str = name
        self.color: str = color
        self.priorityScore: int = priorityScore
        self.icon: UploadFile | None = icon
@app.post('/api/category/update', status_code=200)
async def UpdateCategoryRoute(data: UpdateCategory = Depends()):
    AuthCheck(data, ['admin'])
    with ConnectDb() as conn:
        cursor = conn.cursor()
        if len(data.color) > 7:
            raise HTTPException(status_code=409, detail="Color hex code is incorrect!")        
        filePath: str | None = None
        if data.icon and data.icon.filename:
            if not str(data.icon.filename).endswith('.svg'):
                raise HTTPException(status_code=400, detail="Only SVG file types are allowed.")
            filePath = os.path.join(static, f'{data.name}.svg')
            with open(filePath, 'wb') as fileHandle:
                fileHandle.write(await data.icon.read())            
            cursor.execute('''
                UPDATE categories 
                SET name = ?, color = ?, priorityScore = ?, icon = ? 
                WHERE cid = ?''', (data.name, data.color.upper(), data.priorityScore, filePath, data.cid))
        else:
            cursor.execute('''
                UPDATE categories 
                SET name = ?, color = ?, priorityScore = ? 
                WHERE cid = ?''', (data.name, data.color.upper(), data.priorityScore, data.cid))            
        conn.commit()
    return {'status': 'success', 'message': "Category updated successfully."}

class FetchAllCategories(BaseModel):
    requestId:int
@app.post('/api/categories', status_code=200)
def AllCategories(data:FetchAllCategories):
    AuthCheck(data)
    with ConnectDb() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT cid, name, color, priorityScore, icon 
            FROM categories 
            ORDER BY name DESC''')
        categoriesList:list = cursor.fetchall()
    return [dict(categoryRow) for categoryRow in categoriesList]

class MakeCategory:
    def __init__(self, requestId:int = Form(), name:str = Form(), color:str = Form(..., min_length=3, max_length=7), priorityScore:int = Form(), icon:UploadFile = File()) -> None:
        self.requestId:int = requestId
        self.name:str = name
        self.color:str = color
        self.priorityScore:int = priorityScore
        self.icon:UploadFile = icon
@app.post('/api/category/create', status_code=201)
async def CreateCategory(data:MakeCategory = Depends()):
    AuthCheck(data, ['admin'])
    with ConnectDb() as conn:
        cursor = conn.cursor()
        if not str(data.icon.filename).endswith('.svg'):
            raise HTTPException(status_code=400, detail="Only SVG file types are allowed.")
        filePath:str = os.path.join(static, f'{data.name}.svg')
        with open(filePath, 'wb') as fileHandle:
            fileHandle.write(await data.icon.read())
        cursor.execute('''
            INSERT INTO categories (name, color, priorityScore, icon) 
            VALUES (?, ?, ?, ?)''', (data.name, data.color, data.priorityScore, filePath))
        conn.commit()
    return {'status': 'success', 'message': "Category created successfully."}
