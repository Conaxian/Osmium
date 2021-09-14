#!/bin/bash

temp=$(realpath "$0")
path=$(dirname "$temp")

cd $path/..

scripts/build.sh
npm start
