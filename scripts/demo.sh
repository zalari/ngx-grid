#!/usr/bin/env bash

# Bootstrap an angular demo app using the cli

DIR_EXEC=$(pwd)
DIR_SRC=$(cd "$(dirname "$0")"; pwd)

DEMO_NAME=demo
DEMO_DIR=.temp
DEMO_DIST=demo

COLOR_NONE='\033[0m'
COLOR_YELLOW='\033[0;32m'

## prepare a new Angular app
ng new ${DEMO_NAME} --directory=${DEMO_DIR} --style=scss --routing=false --force --skip-git --skip-tests

## replace the assets
echo "${COLOR_YELLOW}COPY${COLOR_NONE} ${DEMO_DIR}/src/app/app.component.html"
cp ${DIR_SRC}/demo/app.component.html ${DIR_EXEC}/${DEMO_DIR}/src/app/app.component.html

echo "${COLOR_YELLOW}COPY${COLOR_NONE} ${DEMO_DIR}/src/app/app.component.ts"
cp ${DIR_SRC}/demo/app.component.ts ${DIR_EXEC}/${DEMO_DIR}/src/app/app.component.ts

echo "${COLOR_YELLOW}COPY${COLOR_NONE} ${DEMO_DIR}/src/app/app.module.ts"
cp ${DIR_SRC}/demo/app.module.ts ${DIR_EXEC}/${DEMO_DIR}/src/app/app.module.ts

echo "${COLOR_YELLOW}COPY${COLOR_NONE} ${DEMO_DIR}/src/styles.scss"
cp ${DIR_SRC}/demo/styles.scss ${DIR_EXEC}/${DEMO_DIR}/src/styles.scss

# copy the built library
echo "${COLOR_YELLOW}COPY${COLOR_NONE} ${DEMO_DIR}/node_modules/@zalari/ngx-grid"
rm -rf ${DIR_EXEC}/${DEMO_DIR}/node_modules/@zalari/ngx-grid
mkdir -p ${DIR_EXEC}/${DEMO_DIR}/node_modules/@zalari/ngx-grid
cd ${DIR_SRC}/../
cp -rf dist/* ${DIR_EXEC}/${DEMO_DIR}/node_modules/@zalari/ngx-grid
