#!/usr/bin/bash
DIR="reception_cft/CCG/";

shopt -s nullglob dotglob;
for FILE in $DIR/*; do 
echo "sending file $FILE to (AAA) ..."
sftp -v opendata@192.168.140.30 <<EOF
cd $DIR
put $FILE
quit
EOF

rm $FILE;

done;


