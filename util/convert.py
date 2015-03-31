# read german.dic write out as unicode?


import sys
import re
import json

old = "german.dic"


dict = open(old, "r")


cnt=1
st = dict.readline()
# I am ignoring words which _are_ different based on capitalization
# sorry :-/

# this works for the unicode thing.
label_string = ""
value_string = ""
while st:
    #print st
    st = st.lower()
    st = st.rstrip()
    st=st.decode('iso-8859-1')
    st2 = st.encode('utf-8')
    print st2
    st = dict.readline()
