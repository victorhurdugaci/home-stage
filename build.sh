[[ `npm -v` != 3* ]] && sudo npm install -g npm@3
gulp -v || sudo npm install -g gulp

(cd ./build && npm install)

(cd ./src && npm install)
(cd ./src && node ../build/node_modules/typings/dist/bin.js install)

gulp --gulpfile ./build/gulpfile.js $@