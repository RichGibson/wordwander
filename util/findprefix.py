# prefix.py
# look in german.dic for words which contain argv

import sys
import re
import codecs

dict = "german.dic"
#dict = "kaufen.dic"
try: 
    root  = sys.argv[1]
except:
    root = "ziehen"
    print "no root entered, defaulting to %s" % root
print "Search %s for prefixes for  %s " % (dict, root)

# I continue to not understand umlauts and codepoints and all.
#d = codecs.open(dict, "r","utf-8")
d = open(dict, "r")
st = d.readline()
#print type(st)
#sys.exit(2)
prefixes = {}
words = {}

# searches for any prefix, followed by our word, and then ending.
# ex. abkaufen - yes
#     abkaufendem - no
pattern = "%s$" % root
print "pattern:",pattern
regex = re.compile(pattern)
while st:
    st = st.lower()
    st = st.rstrip()
    #m = re.search(root, st)
    r = regex.search(st)
    print "st:%s: r:%r" % (st,r)
    if r:
        pos = st.find(root)
        prefix = st[0:pos]
        try:
            prefixes[prefix] = prefixes[prefix] + 1
        except:
            prefixes[prefix] = 1
            words[prefix] = st
        #print "pos: %i prefix: %s st: %s" % (pos,prefix, st)

    st = d.readline()

for p in sorted(prefixes.keys()):
    print "%s : %s : %i" % (p, words[p], prefixes[p])
