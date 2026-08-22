import hashlib
import sqlite3
import time

DATABASE_FILE:str = 'main.db'

def ConnectDb() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def DropExistingTables(cursor:sqlite3.Cursor) -> None:
    cursor.execute("DROP TABLE IF EXISTS comments")
    cursor.execute("DROP TABLE IF EXISTS tickets")
    cursor.execute("DROP TABLE IF EXISTS locations")
    cursor.execute("DROP TABLE IF EXISTS categories")
    cursor.execute("DROP TABLE IF EXISTS sessions")
    cursor.execute("DROP TABLE IF EXISTS users")
    return None

def CreateTables(cursor:sqlite3.Cursor) -> None:
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
    return None

def PopulateDatabase() -> None:
    conn:sqlite3.Connection = ConnectDb()
    cursor:sqlite3.Cursor = conn.cursor()
    
    DropExistingTables(cursor)
    CreateTables(cursor)
    
    usersData:list[tuple[str, str, str, str, str]] = [
        ('NightRaven', hashlib.sha256('1'.encode()).hexdigest(), 'nightraven@sillyseals.com', 'admin', 'Active'),
        ('Livv', hashlib.sha256('2'.encode()).hexdigest(), 'livv@sillyseals.com', 'staff', 'Active'),
        ('Naushyn', hashlib.sha256('3'.encode()).hexdigest(), 'naush@sillyseals.com', 'user', 'Active'),
        ('staffUser2', hashlib.sha256('4'.encode()).hexdigest(), 'staff2@sillyseals.com', 'staff', 'Active'),
        ('regularUser2', hashlib.sha256('5'.encode()).hexdigest(), 'user2@sillyseals.com', 'user', 'Active')
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO users (username, password, email, role, status) 
        VALUES (?, ?, ?, ?, ?)''', usersData)
    
    categoriesData:list[tuple[str, str, int, str]] = [
        ('Hardware', '#FF5733', 10, 'static/icons/Hardware.svg'),
        ('Software', '#33FF57', 8, 'static/icons/Software.svg'),
        ('Network', '#3357FF', 9, 'static/icons/Network.svg'),
        ('Billing', '#F3FF33', 5, 'static/icons/Billing.svg'),
        ('General', '#FF33F3', 2, 'static/icons/General.svg')
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO categories (name, color, priorityScore, icon) 
        VALUES (?, ?, ?, ?)''', categoriesData)
    
    locationsData:list[tuple[str, int]] = [
        ('Headquarters', 5),
        ('Branch Office A', 3),
        ('Branch Office B', 3),
        ('Remote', 1),
        ('Warehouse', 4)
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO locations (name, priorityScore) 
        VALUES (?, ?)''', locationsData)
    
    currentTime:float = time.time()
    ticketsData:list[tuple[int, int | None, str, str, str, int, int, float, float, int]] = [
        (4, 2, 'Broken Monitor', 'The display panel is cracked and flickering.', 'Open', 1, 1, currentTime, currentTime, 0),
        (4, 3, 'VPN Access Error', 'Unable to connect to the corporate VPN from home.', 'Open', 3, 4, currentTime, currentTime, 0),
        (5, None, 'Password Reset', 'Need a reset for the internal billing system account.', 'Open', 4, 2, currentTime, currentTime, 0),
        (5, 2, 'Office Chair Replacement', 'The armrest on the chair is broken.', 'Open', 5, 1, currentTime, currentTime, 0),
        (4, 2, 'Software License Issue', 'IDE license expired upon startup.', 'Closed', 2, 3, currentTime, currentTime, 0)
    ]
    cursor.executemany('''
        INSERT INTO tickets (submitterUid, assignedUid, title, description, status, cid, lid, createdAt, updatedAt, deleted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', ticketsData)
    
    commentsData:list[tuple[int, int, str, float]] = [
        (1, 2, 'Looking into replacement hardware options.', currentTime),
        (2, 3, 'Please verify your network credentials and try again.', currentTime),
        (3, 1, 'Temporary password has been sent to your email.', currentTime),
        (4, 2, 'Submitted request to facilities management.', currentTime),
        (5, 2, 'License renewed successfully. Closing ticket.', currentTime)
    ]
    cursor.executemany('''
        INSERT INTO comments (ticketId, uid, content, createdAt) 
        VALUES (?, ?, ?, ?)''', commentsData)
    
    conn.commit()
    conn.close()
    print("Database dropped, re-created, and populated successfully with 5 records per table.")
    return None

if __name__ == '__main__':
    PopulateDatabase()