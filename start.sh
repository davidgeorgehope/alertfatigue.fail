#!/bin/bash
# AlertFatigue - Simple Start Script
# Port: Frontend 3083 (no backend)

cd "$(dirname "$0")"

echo "Starting AlertFatigue..."

if ! netstat -tlnp 2>/dev/null | grep -q ":3083 "; then
  echo "  Starting frontend on 3083..."
  nohup npm run start -- -p 3083 > /tmp/alertfatigue-frontend.log 2>&1 &
  sleep 3
else
  echo "  Frontend already running on 3083"
fi

echo "Done. Check: http://localhost:3083"
