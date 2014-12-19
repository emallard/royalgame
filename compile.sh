#!/bin/sh
node compileReferenceTs.js
tsc reference.ts --out public/out/out.js --sourcemap
