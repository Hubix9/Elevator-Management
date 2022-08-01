#!/bin/bash
rm -rf Bundle
mkdir Bundle
cd Frontend
npm run build
cd ..
cd Backend
npm run build
cd ..

cp -R Backend/dist Bundle/dist
cp -R Backend/config Bundle/config
cp -R Backend/node_modules Bundle/node_modules
cp -R Frontend/dist Bundle/dist/www