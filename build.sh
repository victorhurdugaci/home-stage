[[ `npm -v` != 3* ]] && sudo npm install -g npm@3
gulp -v || sudo npm install -g gulp

npm install
node node_modules/typings/dist/bin.js install

gulp $@