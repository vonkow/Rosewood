#!/bin/bash
touch temp.js
cat rosewood.js >> temp.js
cat $1game.js >> temp.js
java -jar ../closure-compiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js temp.js --js_output_file $1compiled.js
rm temp.js
