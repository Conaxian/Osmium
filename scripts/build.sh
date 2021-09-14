#!/bin/bash

temp=$(realpath "$0")
path=$(dirname "$temp")

cd $path/..

for filename in $(find src -name "*.js"); do
    newpath=${filename#"src/"}
    mkdir -p dest/$(dirname "$newpath")
    cp -r $filename dest/$newpath
done

tsc
