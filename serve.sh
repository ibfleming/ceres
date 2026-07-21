#!/bin/bash
# Lightweight static file server for testing the production build
# Serves the 'out/' directory on port 3000

PORT=3000
DIR="out"

if [ ! -d "$DIR" ]; then
  echo "No 'out/' directory found. Run 'pnpm run build' first."
  exit 1
fi

echo "Serving $DIR/ on http://localhost:$PORT"
echo "Press Ctrl+C to stop."
npx -y serve "$DIR" -l "$PORT" -s
