# load top10k
# 584 words are in the wiktionary file but not in my corpus. WTF?

# sqlite3 german.sqlite < words.sql

import sqlite3 as lite
import sys
import re
import json

old = "top10000de.txt"
new = "german.sqlite"

print "german wordexplorer adding 'top' flag database %s from file %s" % (new,old)

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
    #print "st start: ", st
    st = st.lower()
    st = st.rstrip()
    st=st.decode('unicode_escape')
    param = {}
    param["word"] = st

    stmnt = "update words set top=1 where word=:word" 
    #stmnt = "update words set top=1 where word=:word" % (label_string, value_string)
    if cnt % 2 == 0:
        print "%i: %s" % (cnt, st)
        #print "label_string:",label_string
        #print "value_string:",value_string
        print "stmnt:", stmnt
    new_cur.execute(stmnt,param)
    st = dict.readline()
    cnt=cnt+1

new_db.commit()
if new_db:
    new_db.close()
