from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import hashlib, sqlite3

app = FastAPI()
database = "main.db"

class USER(BaseModel):
    username:str
    password:str # HASHED
    role: str
    isActive:bool

class TICKET(BaseModel):
    ticketID:Optional[int] = None
    byUser:str
    title:str
    desc:str
    status:str = None # Assigned Based on System [OPTIONAL]
    assigned:Optional[str] = None # Assigned Based on System
    isDeleted:Optional[bool] = False

class COMMENT(BaseModel):
    id:Optional[int] = None
    ticketID:int
    user:str
    text:str

class CATEGORY(BaseModel):
    name:str
    desc:str
    priority:str
        
def init_db():
    conn = sqlite3.connect(database)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        active INTEGER DEFAULT 0
    )""")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        assigned TEXT,
        deleted INTEGER DEFAULT 0
    )""")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticketID INTEGER NOT NULL,
        user TEXT NOT NULL,
        text TEXT NOT NULL,
        FOREIGN KEY (ticketID) REFERENCES tickets (id)
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS catagories (
        name TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        priority TEXT NOT NULL
    )""")
    conn.commit()
    conn.close()

init_db()
userLogs:list[str] = [] 

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/signup")
def SignUp(user: USER):
    conn, cursor = ConnectDB()
    user.password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    try:
        cursor.execute(
            "INSERT INTO users (username, password, role, active) VALUES (?, ?, ?, ?)",
            (user.username, user.password, user.role, user.isActive)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists!")
    Log(f"Created User: {user.username}")
    raise HTTPException(status_code=201, detail=f"Created User: {user.username}")

@app.post("/login")
def LogIn(username:str, password:str):
    conn, cursor = ConnectDB()
    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    
    if row and Verify(password, row[0]):
        Log(f"User logged in: {username}")
        raise HTTPException(status_code=200, detail=f"Logged into {username}!")     
    raise HTTPException(status_code=401, detail="Username or Password is Incorrect!")

@app.get("/tickets", response_model=list[TICKET]) # Soon will make Staff see only active ones (status not complete)
def ViewTickets(
        username:str,
        status:str = None,
        assigned:str = None,
        deleted:bool = False
    ): # Username & Role will be given automatically
    conn, cursor = ConnectDB()
    row = GetUser(username)
    query = "SELECT id, user, title, description, status, assigned, deleted FROM tickets WHERE 1=1"
    params = []
    if row[0] == "User":
        query += " AND user = ?"
        params.append(username)
    if status is not None:
        query += " AND status = ?"
        params.append(status.capitalize())
    if assigned is not None:
        query += " AND assigned = ?"
        params.append(assigned)
    if deleted is not None:
        query += " AND deleted = ?"
        params.append(int(deleted))
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    usersTickets = [DBConvert(r) for r in rows]
    if not usersTickets:
        Log(f'{username} ({row[0]}): No Tickets Found!')
        raise HTTPException(status_code=404, detail="No Tickets Found!")
    Log(f'{username} ({row[0]}) has Viewed Tickets')
    return usersTickets # Page System [skip:skip+10], skip = (page-1)*10

@app.get("/ticket-{id}")
def GetTicket(id:int, username:str) -> TICKET:
    conn, cursor = ConnectDB()
    row = GetUser(username)
    cursor.execute("SELECT id, user, title, description, status, assigned, deleted FROM tickets WHERE id = ? AND deleted = 0", (id,))
    ticketRow = cursor.fetchone()
    conn.close()
    if not ticketRow:
        Log(f'{username} ({row[0]}): Ticket Not Found')    
        raise HTTPException(status_code=404, detail="Ticket Not Found!")
    ticket = DBConvert(ticketRow)
    if row[0] == "User" and username != ticket.byUser:
        Log(f'{username} ({row[0]}): You do not Own this Ticket by {ticket.byUser}!')
        raise HTTPException(status_code=401, detail="You do not Own this Ticket!")
    Log(f'{username} ({row[0]}) has Viewed a Ticket [{id}]')
    return ticket

@app.post("/tickets/create")
def CreateTicket(ticket: TICKET):
    conn, cursor = ConnectDB()
    row = GetUser(ticket.byUser)
    status = ticket.status.capitalize() or "Pending"
    cursor.execute("""
        INSERT INTO tickets (user, title, description, status, assigned, deleted) VALUES (?, ?, ?, ?, ?, ?)
    """, (ticket.byUser, ticket.title, ticket.desc, status, ticket.assigned, int(ticket.isDeleted)))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    Log(f'{ticket.byUser} ({row[0]}) has made a Ticket [{id}]')
    raise HTTPException(status_code=201, detail=f"Ticket Created [{id}]!")
    # 409 Conflict

@app.post("/ticket-{id}/update")
def UpdateTicket(ticket: TICKET, id:int, username:str):
    conn, cursor = ConnectDB()
    row = GetUser(username)
    cursor.execute("SELECT user, title, description, status, assigned, deleted FROM tickets WHERE id = ?", (id,))
    ticketRow = cursor.fetchone()
    if not ticketRow:
        conn.close()
        raise HTTPException(status_code=404, detail="Ticket Not Found!")
    user, cTitle, cDesc, cStatus, cAssigned, cDeleted = ticketRow
    cDeleted = bool(cDeleted)
    if username == user:
        title = ticket.title if ticket.title else cTitle
        desc = ticket.desc if ticket.desc else cDesc
        cursor.execute("UPDATE tickets SET title = ?, description = ? WHERE id = ?", (title, desc, id))
    elif row[0] == "Staff" and username == user or username == cAssigned and not cDeleted:
        status = ticket.status.capitalize() if ticket.status else cStatus
        cursor.execute("UPDATE tickets SET status = ? WHERE id = ?", (status, id))
    elif row[0] == "Admin":
        status = ticket.status.capitalize() if ticket.status else cStatus
        assigned = ticket.assigned if ticket.assigned is not None else cAssigned
        deleted = ticket.isDeleted if ticket.isDeleted is not None else cDeleted
        cursor.execute("UPDATE tickets SET status = ?, assigned = ?, deleted = ? WHERE id = ?", (status, assigned, int(deleted), id))
    else:
        conn.close()
        raise HTTPException(status_code=401, detail="You are not authorized to update this ticket!")
    conn.commit()
    conn.close()
    Log(f"{username} ({row[0]}) updated ticket [{id}]")
    return {"detail": f"Ticket #{id} updated successfully by {username}."}

@app.get("/ticket-{id}/comment")
def GetComments(id:int, username:str):
    conn, cursor = ConnectDB()
    row = GetUser(username)
    cursor.execute("SELECT user FROM tickets WHERE id = ? AND deleted = 0", (id,))
    ticketRow = cursor.fetchone()
    if not ticketRow:
        conn.close()
        Log(f'{username} ({row[0]}): Tried to view comments on missing Ticket [{id}]')
        raise HTTPException(status_code=404, detail="Ticket Not Found!")
    if row[0] == "User" and username != ticketRow[0]:
        conn.close()
        Log(f'{username} ({row[0]}): Unauthorized comments view on Ticket [{id}] owned by {ticketRow[0]}!')
        raise HTTPException(status_code=401, detail="You do not own this ticket!")
    cursor.execute("SELECT id, ticketID, user, text FROM comments WHERE ticketID = ?", (id,))
    commentRow = cursor.fetchall()
    conn.close()
    comments = [COMMENT(id=r[0], ticketID=r[1], user=r[2], text=r[3]) for r in commentRow]
    Log(f'{username} ({row[0]}) viewed comments on Ticket [{id}]')
    return comments    

@app.post("/ticket-{id}/comment/create", status_code=201)
def CreateComment(comment: COMMENT, id:int, username:str):
    conn, cursor = ConnectDB()
    row = GetUser(username)
    cursor.execute("SELECT user, deleted FROM tickets WHERE id = ?", (id,))
    ticketRow = cursor.fetchone()
    if not ticketRow or bool(ticketRow[1]):
        conn.close()
        Log(f'{username} ({row[0]}): Tried to comment on missing/deleted Ticket [{id}]') #[cite: 2]
        raise HTTPException(status_code=404, detail="Ticket Not Found!")
    if row[0] == "User" and username != ticketRow[0]:
        conn.close()
        Log(f'{username} ({row[0]}): Unauthorized comment attempt on Ticket [{id}] owned by {ticketRow[0]}!') #[cite: 2]
        raise HTTPException(status_code=401, detail="You do not own this ticket!")
    cursor.execute("""INSERT INTO comments (ticketID, user, text) VALUES (?, ?, ?)""", (id, username, comment.text))
    conn.commit()
    commentID = cursor.lastrowid
    conn.close()
    Log(f'{username} ({row[0]}) added comment [{commentID}] to Ticket [{id}]')
    return {"detail": f"Comment successfully added to Ticket #{id}."}

@app.post("/coffee")
def Coffee():
    # I HAD TO!
    Log(f'Someone Tried to Brew Coffee, from a Teapot!')
    raise HTTPException(status_code=418, detail="I refuse to Brew Coffee, I'ma Teapot!")

@app.get("/logs")
def UserLogs(username:str):
    row = GetUser(username)
    if row[0] != "Admin":
        raise HTTPException(status_code=401, detail="You are not authorized to view this!")
    return userLogs
    
def Log(message:str):
    userLogs.append(message)

def Verify(password:str, hashed:str) -> bool:
    return hashlib.sha256(password.encode('utf-8')).hexdigest() == hashed

def ConnectDB():
    conn = sqlite3.connect(database)
    cursor = conn.cursor()
    return conn, cursor

def DBConvert(row) -> TICKET:
    return TICKET(
        ticketID=row[0],
        byUser=row[1],
        title=row[2],
        desc=row[3],
        status=row[4],
        assigned=row[5],
        isDeleted=bool(row[6])
    )

def GetUser(user):
    conn, cursor = ConnectDB()
    cursor.execute("SELECT role FROM users WHERE username = ?", (user,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"User '{user}' does not exist. Cannot create ticket.")
    return row

@app.post("/categories/create", status_code=201)
def CreateCategory(category: CATEGORY, username: str):
    row = GetUser(username)
    if row[0] !="Admin":
        raise HTTPException(status_code=401, detail="ONLY Admins are allowed to manage categories.")
    conn, cursor = ConnectDB()
    cursor.execute(
        "INSERT INTO categories (name, description, priority) VALUES (?, ?, ?)", 
        (category.name, category.description, category.priority))
    if row[0] !="Admin":
        conn.close()
        raise HTTPException(status_code=400, detail= "Category name already exists.")
    conn.commit()
    conn.close()
    Log(f"Admin {username} created category: {category.name}")
    return {"detail": f"Category '{category.name}' created."}

@app.get("/categories", response_model=list[CATEGORY])
def ReadCategories(username: str):
    row = GetUser(username)
    if row[0] != "Admin":
        raise HTTPException(status_code=401, detail="ONLY Admins are allowed to manage categories.")
    conn, cursor = ConnectDB()
    cursor.execute("SELECT name, description, priority FROM categories")
    rows = cursor.fetchall()
    conn.close()

    categories = [CATEGORY(name=r[0], description=r[1], priority=r[2]) for r in rows]
    Log(f"Admin {username} viewed all categories.")
    return categories

@app.post("/categories/update")
def UpdateCategory(category: CATEGORY, username: str):
    row = GetUser(username)
    if row[0] != "Admin":
        raise HTTPException(status_code=401, detail="ONLY Admins are allowed to manage categories.")
    
    conn, cursor = ConnectDB()
    cursor.execute("SELECT name FROM categories WHERE name = ?", (category.name))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Category does not exist.")
    
    cursor.execute(
        "UPDATE categories SET description = ?, priority = ? WHERE name = ?"
        (category.description, category.priority, category.name)
)
    conn.commit()
    conn.close()
    Log(f"Admin {username} updated the category: {category.name}")
    return{"detail": f"category '{category.name}' updated."}

@app.delete("/categories/delete")
def DeleteCategory(name: str, username: str):
    row = GetUser(username)
    if row[0] != "Admin":
        raise HTTPException(status_code=401, detail="ONLY Admins are allowed to manage categories.")
    conn, cursor = ConnectDB()
    cursor.execute("SELECT name FROM categories WHERE name = ?" (name))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Category does not exist.")
    
    cursor.execute("DELETE FROM categories WHERE name = ?" (name))
    conn.commit()
    conn.close()
    Log(f"Admin {username} deleted category; {name}")
    return {"detail": f"Category '{name}' deleted."}




# Thought of a session idea, Problem anyone sending a API Req can write a Admin...
# Username, so instead we can give a session id that gets sended and the id... (hash)
# Will contain their userlogs! Users cant guess others session id since its random.
# An API Request can extend their session and will be called every 10mins.