from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, List
import sqlite3, hashlib

app = FastAPI()
database = "main.db"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", '*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

def AuthCheck(data):
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, role FROM users WHERE id = ?', (data.requestId,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="UnAuthorized!")
        return user

def initDB():
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            role TEXT NOT NULL
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
        conn.commit()
initDB()

class FetchOneTICKET(BaseModel):
    ticketId:int
    requestId:int
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

    if not (ticket['userId'] == data.requestId or ticket['staffId'] == data.requestId or user["role"] == 'admin'):
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

class UpdateTICKETS(BaseModel):
    ticketId: int
    requestId: int
    title: str | None = Field(None, min_length=5, max_length=50)
    description: str | None = Field(None, max_length=250)
    category: Literal['help', 'clean', 'maintenance'] | None = None
    status: str | None = None
    staffId: int | None = None
    deleted: bool | None = None
@app.post("/api/ticket-{id}/update", status_code=200)
def UpdateTicket(data: UpdateTICKETS):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT ticketId, userId, staffId
            FROM tickets
            WHERE ticketId = ? AND deleted = 0
        ''', (data.ticketId,))
        ticket = cursor.fetchone()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket Not Found!")  
        if not (ticket['userId'] == data.requestId or ticket['staffId'] == data.requestId or user["role"] == 'admin'):
            raise HTTPException(status_code=403, detail="Access denied!")
        if (ticket['userId'] == data.requestId or user["role"] == 'admin'):
            cursor.execute('''
                UPDATE tickets
                SET title = ?, description = ?, category = ?
                WHERE ticketId = ? AND deleted = 0
            ''', (data.title, data.description, data.category, data.ticketId))
        if ticket['staffId'] == data.requestId: 
            cursor.execute('''
                UPDATE tickets
                SET status = ?, staffId = ?
                WHERE ticketId = ? AND deleted = 0
            ''', (data.status, data.requestId, data.ticketId))
        if user['role'] == 'admin':
            deleted = 1 if data.deleted else 0
            cursor.execute('''
                UPDATE tickets
                SET status = ?, deleted = ?
                WHERE ticketId = ?
            ''', (data.status, deleted  , data.ticketId))
    return
        
class FetchAllTICKETS(BaseModel):
    requestId:int
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
    title:str = Field(..., min_length=5, max_length=50)
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

        x = cursor.lastrowid

        cursor.execute('''
            SELECT ticketId, userId, staffId, title, description, status, category
            FROM tickets WHERE ticketId = ?''', (x,))

        x = dict(cursor.fetchone())
        if not x:
            raise HTTPException(status_code=404, detail="Ticket Creation Failed!")
    return x

class SearchTICKET(BaseModel):
    requestId:int
    query:str
    mode:str | None = None
@app.post("/api/search/ticket", status_code=200)
def SearchTicket(data:SearchTICKET):
    user = AuthCheck(data)
    with ConnectDB() as conn:
        cursor = conn.cursor()
        cursor.execute(f'''
            SELECT ticketId, title
            FROM tickets
            WHERE title LIKE ?{' AND deleted = 0' if not user['role'] == 'admin' else ''}
        ''', (f'%{data.query}%',))
        tickets = cursor.fetchall()
    return dict(tickets)
