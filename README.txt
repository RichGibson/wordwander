german wordexplorer notes

Add top10000 feature.
-modify schema - python 
alter table words add top integer;
create index 'fk_words' on 'words' ('word');
create index 'fk_top' on 'words' ('top');
http://wortschatz.uni-leipzig.de/Papers/top10000de.txt
top10000de.txt

I started with the german dictionay. 

I 'fixed' (?) the file with convert.py
python ./convert.py > german.fix

I think the keys were:
st=st.decode('iso-8859-1')
st2 = st.encode('utf-8')
print st2

maybe :-/

Then loaded into sqlite3
.import ./german.fix words

some sql:

grab words which end with our root.
select * from words where word like '%ziehen' ;

Words which contain our root:
select * from words where word like '%ziehen%' ;

Count of words which end with our root.
select count(*) from words where word like '%ziehen';
170

Count of words which conain our root:
select count(*) from words where word like '%ziehen%';
697

SUBSTR(field_name,start_location,substring_length )

concatanate strings
||

glob operator, wow! 
* - multiple characters, ? - single character
select word from words where word glob 'b?ziehen';
beziehen

sqlite> select word from words where word glob 'b*ziehen';
beizuziehen
beziehen
blankziehen
blinkziehen

instr and substr

Find prefixes in one query.
select word, substr(word,0,instr(word,'ziehen')), instr(word, 'ziehen') 
from words where word glob '*ziehen';


