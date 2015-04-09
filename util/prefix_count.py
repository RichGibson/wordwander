# prefix_count.py - how many words start with each prefix...


import sqlite3 as lite
import sys
import re
import json

new = "../german.sqlite"


def connect(name):
    cur = None
    try:
        db = lite.connect(name)
        cur = db.cursor()
        cur.execute('SELECT SQLITE_VERSION()')
        data = cur.fetchone()

        print "db %s SQLite version: %s" % (name,data)
        return db
    except lite.Error, e:

        print "Error %s:" % e.args[0]
        sys.exit(1)


new_db = connect(new)

new_cur = None
new_cur = new_db.cursor()
pre_cur = new_db.cursor()
stmnt = "select prefix from prefixes"
param = {}
new_cur.execute(stmnt,param)

row = new_cur.fetchone()
while row:
    #print row
    param['prefix'] = row
    stmnt = "select * from words where word like '%s%%'" % row
    stmnt = "select count(*) from words where word like '%s%%'" % row
    #print stmnt
    pre_cur.execute(stmnt,param)
    data = pre_cur.fetchone()
    print row,data
    #while data:
    #    print "\tdata: ",data
    #    data = pre_cur.fetchone()
    
 
    row = new_cur.fetchone()

new_db.commit()
if new_db:
    new_db.close()
