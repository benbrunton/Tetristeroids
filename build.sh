rm -r bin
mkdir bin
mkdir bin/js
r.js -o build.js

cp src/index.html bin/index.html
cp -r src/libs bin/libs
cp -r src/assets bin/assets