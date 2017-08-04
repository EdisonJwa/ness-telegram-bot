find . -name '*.js' | xargs wc -l | tail -n 1 | awk '{ print $1 }' > line.txt
