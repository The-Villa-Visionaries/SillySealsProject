from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Literal
import sqlite3, hashlib, os, time, secrets
from pathlib import Path

app = FastAPI()
database = "main.db"
staticFiles = "static/icons"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", '*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/static", 
    StaticFiles(
        directory="static"), 
    name="static"
)

class TICKET(BaseModel):
    ticketId:int
    userId:int
    staffId:int
    title:str
    description:str
    status:str
    category:Literal['help', 'clean', 'maintenance'] = 'help'
    deleted:str

def ConnectDB():
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    return conn

def initDB():
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            primarySID TEXT PRIMARY KEY,
            altSID TEXT,
            userId INTIGER UNIQUE,
            expireTime FLOAT
        )""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            ticketId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            staffId INTEGER,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL,
            category TEXT CHECK(category IN ('help', 'clean', 'maintenance')) DEFAULT 'help',
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (staffId) REFERENCES users(id)
        )""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS category (
            name TEXT PRIMARY KEY,
            color TEXT NOT NULL
        )""")
        conn.commit()
initDB()

def AuthCheck(data, validation=[]):
    if validation == []:
        validation = ['user', 'staff', 'admin']
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, role FROM users WHERE id = ?', (data.requestId,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="UnAuthorized!")
        elif not user['role'] in validation:
            raise HTTPException(status_code=403, detail="The server has refused your requested.")
        return user

def GenSID(userID, conn):
    cursor = conn.cursor()
    primarySID = secrets.token_hex(32)
    expireTime = time.time() + 900
    cursor.execute("""
        INSERT INTO sessions (primarySID, altSID, userID, expireTime)
        VALUES (?, ?, ?, ?)
    """, (primarySID, '', userID, expireTime))
    print(primarySID)
    return primarySID

class SearchALL(BaseModel):
    requestId:int
    query:str
    searchMode:str | None = None
@app.post("/api/search", status_code=200)
def SearchAll(data:SearchALL):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        if data.searchMode == 'category' and user['role'] == 'admin':
            cursor.execute('''
                SELECT name, color
                FROM category
                WHERE name LIKE ?
            ''', (f'%{data.query}%',))
            output = cursor.fetchall()
        else:
            cursor.execute(f'''
                SELECT ticketId, title
                FROM tickets
                WHERE title LIKE ?{' AND deleted = 0' if not user['role'] == 'admin' else ''}
            ''', (f'%{data.query}%',))
            output = cursor.fetchall()
        return dict(output)

class FetchOneTICKET(BaseModel):
    ticketId:int
    requestId:int
    allowOpen:str | None = None
@app.post("/api/ticket-{id}/view", status_code=200)
def GetTicket(data: FetchOneTICKET):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute(f'''
            SELECT ticketId, userId, staffId, title, description, status, category 
            FROM tickets 
            WHERE ticketId = ?{' AND deleted = 0' if not user['role'] == 'admin' else ''}''', (data.ticketId,))
        ticket = cursor.fetchone()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket Not Found!")
    elif data.allowOpen and not (ticket['userId'] == data.requestId or ticket['staffId'] == data.requestId or user["role"] == 'admin'):
        raise HTTPException(status_code=403, detail="Access denied!")
    return dict(ticket)

@app.post("/api/ticket-{id}/delete", status_code=200)
def DeleteTicket(data: FetchOneTICKET):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT ticketId, userId
            FROM tickets
            WHERE ticketId = ? AND deleted = 0
        ''', (data.ticketId,))
        ticket = cursor.fetchone()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found!")
        if not (ticket['userId'] == data.requestId or user['role'] == 'admin'):
            print(ticket['userId'], user['role'])
            raise HTTPException(status_code=403, detail="Access denied!")
        cursor.execute('''
            UPDATE tickets 
            SET deleted = 1
            WHERE ticketId = ?
        ''', (data.ticketId,))
    return {"status": "success", "message": f"Deleted Ticket-{data.ticketId}"}

@app.post("/api/ticket-{id}/abandon", status_code=200)
def AbandonTicket(data: FetchOneTICKET):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT staffId, status
            FROM tickets
            WHERE ticketId = ? AND deleted = 0
        ''', (data.ticketId,))
        ticket = cursor.fetchone()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket Not Found!")  
        elif user['role'] == 'user' or ticket['staffId'] != data.requestId:
            raise HTTPException(status_code=403, detail="Access denied!")
        elif ticket['status'] == 'closed':
            raise HTTPException(status_code=400, detail="Cannot Abandon a Closed Ticket!")
        cursor.execute('''
            UPDATE tickets
            SET staffId = ?, status = 'open'
            WHERE ticketId = ? AND deleted = 0
        ''', (None, data.ticketId))

class UpdateTICKETS(BaseModel):
    ticketId:int
    requestId:int
    user:int | None = None
    title:str | None = Field(None, min_length=3, max_length=50)
    description:str | None = Field(None, max_length=250)
    category:str | None = None
    status:str | None = None
    staffId:int | None = None
    deleted:bool | None = None
@app.post("/api/ticket-{id}/update", status_code=200)
def UpdateTicket(data: UpdateTICKETS):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        delete:str = '' if user['role'] == 'admin' else ' AND deleted = 0'
        cursor.execute(f'''
            SELECT ticketId, userId, staffId, status
            FROM tickets
            WHERE ticketId = ?{delete}
        ''', (data.ticketId,))
        ticket = cursor.fetchone()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket Not Found!")  
        elif not (ticket['userId'] == data.requestId or ticket['staffId'] == data.requestId or ticket['staffId'] == None or user["role"] == 'admin'):
            raise HTTPException(status_code=403, detail="Access denied!")
        if (ticket['userId'] == data.requestId or user["role"] == 'admin'):
            cursor.execute('''
                UPDATE tickets
                SET title = ?, description = ?, category = ?
                WHERE ticketId = ? AND deleted = 0
            ''', (data.title, data.description, data.category, data.ticketId))
        if ticket['staffId'] == data.requestId or ticket['staffId'] == None and user['role'] == 'staff': 
            cursor.execute('''
                SELECT ticketId
                FROM tickets
                WHERE staffId = ? AND status != 'closed' AND deleted = 0
            ''', (data.requestId,))
            Check = cursor.fetchone()
            if Check and ticket['status'] == 'open' and user["role"] == 'admin':
                raise HTTPException(status_code=409, detail="Please close your existing ticket before accepting a new ticket!")
            elif data.status == 'open' and user["role"] == 'admin':
                raise HTTPException(status_code=400, detail="Status cannot be empty!")
            elif ticket['status']== 'closed' and Check and user["role"] == 'admin':
                raise HTTPException(status_code=400, detail="Please close your existing ticket before changing a ticket!")
            cursor.execute('''
                UPDATE tickets
                SET status = ?, staffId = ?, category = ?
                WHERE ticketId = ? AND deleted = 0
            ''', (data.status, data.requestId, data.category, data.ticketId))
        if user['role'] == 'admin':
            if not data.deleted:
                data.deleted = False
            cursor.execute('''
                UPDATE tickets
                SET userId = ?, title = ?, description = ?, category = ?, status = ?, staffId = ?, deleted = ?
                WHERE ticketId = ?
            ''', (data.user, data.title, data.description, data.category, data.status, data.staffId, int(data.deleted), data.ticketId))
    return {"status": "success", "message": f"Ticket-{data.ticketId} updated"}
        
class FetchAllTICKETS(BaseModel):
    requestId:int
    allowOpen:str | None = None
@app.post("/api/tickets", status_code=200)
def AllTickets(data: FetchAllTICKETS):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
    if user['role'] == 'admin':
        cursor.execute(f'''
            SELECT ticketId, userId, staffId, title, description, status, category 
            FROM tickets 
            ORDER BY status ASC, ticketId DESC
        ''')
    elif user['role'] == 'staff' and data.allowOpen:
        cursor.execute('''
            SELECT ticketId, userId, staffId, title, description, status, category 
            FROM tickets
            WHERE (status = 'open' OR staffId = ?) AND deleted = 0
            ORDER BY ticketId DESC, title DESC
        ''', (data.requestId,))
    else:
        cursor.execute('''
            SELECT ticketId, userId, staffId, title, description, status, category 
            FROM tickets
            WHERE (userId = ? OR staffId = ?) AND deleted = 0
            ORDER BY status ASC, ticketId DESC
        ''', (data.requestId, data.requestId))
    tickets = cursor.fetchall()
    return [dict(ticket) for ticket in tickets]

class MakeTICKET(BaseModel):
    requestId:int
    title:str = Field(..., min_length=3, max_length=50)
    description:str = Field(..., max_length=250)
    category:Literal["help", "clean", "maintenance"]
@app.post("/api/ticket/create", status_code=201)
def CreateTicket(data: MakeTICKET):
    AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO tickets (userId, staffId, title, description, status, category, deleted)
            VALUES (?, NULL, ?, ?, 'open', ?, 0)''', (data.requestId, data.title, data.description, data.category))
        conn.commit()
    return {"status": "success", "message": f"Ticket '{data.title}' Made"}

class FetchOneCATEGORY(BaseModel):
    requestId:int
    name:str
@app.post("/api/category/view", status_code=200)
def GetCategory(data:FetchOneCATEGORY):
    AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT name, color
            FROM category
            WHERE name = ?
        ''', (data.name,))
        category = cursor.fetchone()
        return dict(category)

@app.post("/api/category/color", status_code=200)
def GetCategoryColor(data:FetchOneCATEGORY):
    AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT color
            FROM category
            WHERE name = ?
        ''', (data.name,))
        colorRow = cursor.fetchone()
    if colorRow:
        return colorRow['color']

@app.post("/api/category/delete", status_code=200)
def DeleteCategory(data: FetchOneCATEGORY):
    AuthCheck(data, ['admin'])
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM category
            WHERE name = ?
        ''', (data.name,))
        deleteSVG = Path("static/icons") / f"{data.name}.svg"
        deleteSVG.unlink(missing_ok=True)
    return {"status": "success", "message": f"Category '{data.name}' deleted."}

class UpdateCATEGORY(BaseModel):
    requestId:int
    changeFrom:str
    changeTo: str
    color:str
@app.post("/api/cetegory/update", status_code=200)
def UpdateCategory(data: UpdateCATEGORY):
    AuthCheck(data, ['admin'])
    with ConnectDB() as conn:
        cursor = conn.cursor()
        if len(data.color) > 7:
            raise HTTPException(status_code=409, detail="Color Hex Code is incorect!")  
        cursor.execute('''
            UPDATE category
            SET name = ?, color = ?
            WHERE name = ?
        ''', (data.changeTo, data.color.upper(), data.changeFrom))
        dir = Path("static/icons")
        old = dir / f"{data.changeFrom}.svg"
        new = dir / f"{data.changeTo}.svg"
        if old.exists():
            old.rename(new)
            conn.commit()
    return {"status": "success", "message": "Category and icon updated"}

class FetchAllCATEGORY(BaseModel):
    requestId:int
@app.post("/api/category", status_code=200)
def AllCategory(data: FetchAllCATEGORY):
    AuthCheck(data, ['admin'])
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT name, color
            FROM category
            ORDER BY name DESC
        ''')
        categories = cursor.fetchall()
    return [dict(category) for category in categories]

class MakeCATEGORY():
    def __init__(self, requestId:int = Form(), name:str = Form(), color: str = Form(..., min_length=3, max_length=7), icon:UploadFile = File()):
        self.requestId = requestId
        self.name = name
        self.color = color
        self.icon = icon
@app.post("/api/category/create", status_code=201)
async def CreateCategory(data: MakeCATEGORY = Depends()):
    AuthCheck(data, ['admin'])
    with ConnectDB() as conn:
        cursor = conn.cursor()
        if not str(data.icon.filename).endswith(".svg"):
            raise HTTPException(status_code=400, detail="Only 'SVG' File types are allowed.")
        filePath = os.path.join(staticFiles, f"{data.name}.svg")
        with open(filePath, "wb") as f:
            f.write(await data.icon.read())
        cursor.execute('''
            INSERT INTO category (name, color)
            VALUES (?, ?)
        ''', (data.name, data.color))
        conn.commit()
    return {"status": "success", "message": f"Category '{data.name}' Made"}

class LogInUSER(BaseModel):
    name:str
    password:str
@app.post("/api/login", status_code=200)
def LogInUser(data: LogInUSER):
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, password, id
            FROM users
            WHERE username = ?
        """, (data.name,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Username or Password is Incorrect!")
        password = hashlib.sha256(data.password.encode()).hexdigest()
        if password != user['password']:
            raise HTTPException(status_code=401, detail="Username or Password is Incorrect!")
        sid = GenSID(user['id'], conn)
        return sid

class SignUpUSER(BaseModel):
    name:str
    password:str
@app.post("/api/signup", status_code=200)
def SignUpUser(data: SignUpUSER):
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username
            FROM users
            WHERE username = ?
        """, (data.name,))
        user = cursor.fetchone()
        if user:
            raise HTTPException(status_code=401, detail="Username has already been taken!")
        password = hashlib.sha256(data.password.encode()).hexdigest()       
        cursor.execute('''
            INSERT INTO users (username, password)
            VALUES (?, ?)
        ''', (data.name, password))
        userId = cursor.lastrowid
        return GenSID(userId, conn)