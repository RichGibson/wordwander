# load_prefixes - load the prefixes table
# this worked...so, whatever?


import sqlite3 as lite
import sys
import re
import json

old = "prefixes.txt"
new = "../german.sqlite"

print "german wordexplorer adding prefixes fromfile %s" % (old)

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


dict = open(old, "r")
new_db = connect(new)

new_cur = None
new_cur = new_db.cursor()

cnt=1
st = dict.readline()
# I am ignoring words which _are_ different based on capitalization
# sorry :-/
label_string = ""
value_string = ""
while st:
    #print "%i: %r " % (cnt, st)
    print "st start: ", st
    st = st.lower()
    st = st.rstrip()
    st=st.decode('utf-8')
    #st=st.decode('unicode_escape')

    #st=st.encode('iso-8859-1')
    #print  "2:",type(st)
    #st = st.encode('unicode_escape')
    #st = st.encode('utf-8')
    print "st end: ", st
    lst=st.split(',')
    prefix = lst[0]
    type = lst[1]
    param = {}
    param["prefix"] = prefix
    param["type"] = type

    stmnt = "insert into prefixes values (:prefix, :type)" 
    print "%i: %s" % (cnt, st)
    print "stmnt:", stmnt
    new_cur.execute(stmnt,param)
    st = dict.readline()
    cnt=cnt+1

new_db.commit()
if new_db:
    new_db.close()
