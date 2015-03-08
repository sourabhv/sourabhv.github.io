#!/bin/sh

function _make () {
    read path
    filename=$(basename $path | cut -f1 -d'.');
    make "$filename.css"
}

make
fswatch -0 *.less | xargs -0 -n1 -I{} make
# fswatch *.less | _make
