#!/usr/bin/env bash

if (( $# < 1 )); then
  echo "No library specified as argument." >&2
  exit 1
fi

for lib in "$@"; do
  timeout 10 node ./find-pollution.js "$lib"
done
