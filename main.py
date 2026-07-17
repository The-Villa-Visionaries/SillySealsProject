from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

ticketList:list[str] = []

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

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/view", response_model=list[TICKET])
def ViewTickets(username:str = None, role:str = "Admin"): # Username & Role will be given automatically
    usersTickets:list[TICKET] = []
    for ticket in ticketList:
        if role == "User":
            if username == ticket.byUser:
                usersTickets.append(ticket)
        else:
            usersTickets.append(ticket)
    if usersTickets == []:
        raise HTTPException(status_code=404, detail="No Tickets Found!")
    return usersTickets

@app.get("/view/{id}")
def GetTicket(id:int, username:str, role:str = "Admin") -> TICKET:
    for ticket in ticketList:
        if ticket.ticketID == id and ticket.isDeleted == False:
            if username != ticket.byUser and role == "User":
                raise HTTPException(status_code=401, detail="You do not Own this Ticket!")
            return ticket
    raise HTTPException(status_code=404, detail="Ticket Not Found!")

@app.post("/create")
def CreateTicket(ticket: TICKET):
    ticket.ticketID = len(ticketList) + 1
    ticket.status = "Pending"
    ticket.isDeleted = False
    ticketList.append(ticket)
    return f"Appended {ticket} to {ticketList}"
    # 409 Conflict
    
@app.post("/coffee")
def Coffee():
    # I HAD TO!
    raise HTTPException(status_code=418, detail="I refuse to Brew Coffee, I'ma Teapot!")

# Thought of a session idea, Problem anyone sending a API Req can write a Admin...
# Username, so instead we can give a session id that gets sended and the id... (hash)
# Will contain their userlogs! Users cant guess others session id since its random.
# An API Request can extend their session and will be called every 10mins.