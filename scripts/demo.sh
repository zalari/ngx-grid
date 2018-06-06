#!/usr/bin/env bash

# Bootstrap an angular demo app using the cli

DIR_EXEC=$(pwd)
DIR_SRC=$(cd "$(dirname "$0")"; pwd)

DEMO_PORT=4444
DEMO_NAME=demo
DEMO_DIR=.temp

COLOR_NONE='\033[0m'
COLOR_YELLOW='\033[0;32m'

## prepare a new Angular app
# rm -rf ${DEMO_DIR}
ng new ${DEMO_NAME} --directory=${DEMO_DIR} --style=scss --routing=false --force --skip-git --skip-tests

## replace the assets
echo -e "${COLOR_YELLOW}COPY${COLOR_NONE} ${DIR_SRC}/demo/app.component.html ${COLOR_YELLOW}>${COLOR_NONE} ${DEMO_DIR}/src/app/app.component.html"
cp ${DIR_SRC}/demo/app.component.html ${DEMO_DIR}/src/app/app.component.html

echo -e "${COLOR_YELLOW}COPY${COLOR_NONE} ${DIR_SRC}/demo/app.module.ts ${COLOR_YELLOW}>${COLOR_NONE} ${DEMO_DIR}/src/app/app.module.ts"
cp ${DIR_SRC}/demo/app.module.ts ${DEMO_DIR}/src/app/app.module.ts

echo -e "${COLOR_YELLOW}COPY${COLOR_NONE} ${DIR_SRC}/demo/styles.scss ${COLOR_YELLOW}>${COLOR_NONE} ${DEMO_DIR}/src/styles.scss"
cp ${DIR_SRC}/demo/styles.scss ${DEMO_DIR}/src/styles.scss

# copy the built library
echo -e "${COLOR_YELLOW}COPY${COLOR_NONE} ${DIR_SRC}/../dist ${COLOR_YELLOW}>${COLOR_NONE} ${DEMO_DIR}/node_modules/@zalari/ngx-grid"
rm -rf ${DIR_EXEC}/${DEMO_DIR}/node_modules/@zalari/ngx-grid
mkdir -p ${DIR_EXEC}/${DEMO_DIR}/node_modules/@zalari/ngx-grid
cd ${DIR_SRC}/../
cp -rf dist/* ${DIR_EXEC}/${DEMO_DIR}/node_modules/@zalari/ngx-grid

## start the demo
#cd ${DEMO_DIR} && ng serve --port ${DEMO_PORT} --watch=false --progress=false --live-reload=false --open=true
cd ${DIR_EXEC}/${DEMO_DIR} && ng serve --port ${DEMO_PORT}
