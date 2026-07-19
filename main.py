from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import hashlib, secrets

app = FastAPI()

usersList:list[str] = []
ticketList:list[str] = []
userLogs:list[str] = []

class USER(BaseModel):
    username:str
    password:str # HASHED
    role: str

class TICKET(BaseModel):
    ticketID:Optional[int] = None
    byUser:str
    title:str
    desc:str
    status:Optional[str] = None # Assigned Based on System
    assigned:Optional[str] = None # Assigned Based on System
    isDeleted:Optional[bool] = False
    
    
class CATEGORY(BaseModel):
    name:str
    desc:str
    priority:str

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/signup")
def SignUp(user: USER):
    user.password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    usersList.append(user)
    log(f"Created User: {user.username}")
    raise HTTPException(status_code=201, detail=f"Created User: {user.username}")

@app.post("/login")
def LogIn(username:str, password:str):
    for user in usersList:
        if user.username == username and verify(password, user.password):
            raise HTTPException(status_code=200, detail=f"Logged into {user.username}!")
    raise HTTPException(status_code=401, detail="Username or Password is Incorrect!")

@app.post("/view", response_model=list[TICKET]) # Soon will make Staff see only active ones (status not complete)
def ViewTickets(username:str = None, role:str = "Admin"): # Username & Role will be given automatically
    usersTickets:list[TICKET] = []
    for ticket in ticketList:
        if role == "User":
            if username == ticket.byUser:
                usersTickets.append(ticket)
        else:
            usersTickets.append(ticket)
    if usersTickets == []:
        log(f'{username} ({role}): No Tickets Found!')
        raise HTTPException(status_code=404, detail="No Tickets Found!")
    log(f'{username} ({role}) has Viewed Tickets')
    return usersTickets # Page System [skip:skip+10], skip = (page-1)*10

@app.get("/view/{id}")
def GetTicket(id:int, username:str, role:str = "Admin") -> TICKET:
    for ticket in ticketList:
        if ticket.ticketID == id and ticket.isDeleted == False:
            if username != ticket.byUser and role == "User":
                log(f'{username} ({role}): You do not Own this Ticket by {ticket.byUser}!')
                raise HTTPException(status_code=401, detail="You do not Own this Ticket!")
            log(f'{username} ({role}) has Viewed a Ticket [{id}]')
            return ticket
    log(f'{username} ({role}): Ticket Not Found')    
    raise HTTPException(status_code=404, detail="Ticket Not Found!")

@app.post("/create")
def CreateTicket(ticket: TICKET):
    ticket.ticketID = len(ticketList) + 1
    ticket.status = "Pending" # Pending > Assigned > Completed
    
    ticket.isDeleted = False
    ticketList.append(ticket)
    log(f'{ticket.byUser} (Unknown) has made a Ticket [{ticket.ticketID}]')
    return f"Appended {ticket} to {ticketList}"
    # 409 Conflict

@app.post("/coffee")
def Coffee():
    # I HAD TO!
    log(f'Someone Tried to Brew Coffee, from a Teapot!')
    raise HTTPException(status_code=418, detail="I refuse to Brew Coffee, I'ma Teapot!")

@app.post("/logs")
def UserLogs(role:str = "Admin"):
    if role == "Admin":
        return userLogs
    
def log(message:str):
    userLogs.append(message)

def verify(password:str, hashed:str) -> bool:
    return hashlib.sha256(password.encode('utf-8')).hexdigest() == hashed
# Thought of a session idea, Problem anyone sending a API Req can write a Admin...
# Username, so instead we can give a session id that gets sended and the id... (hash)
# Will contain their userlogs! Users cant guess others session id since its random.
# An API Request can extend their session and will be called every 10mins.