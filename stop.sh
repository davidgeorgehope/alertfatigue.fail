#!/bin/bash
# AlertFatigue - Simple Stop Script
# Only kills process on port 3083 that is NOT docker

cd "$(dirname "$0")"

echo "Stopping AlertFatigue..."

PID=$(netstat -tlnp 2>/dev/null | grep ":3083 " | grep -v docker | awk '{print $7}' | cut -d'/' -f1)
if [ -n "$PID" ]; then
  echo "  Stopping frontend (PID $PID)..."
  kill $PID 2>/dev/null
fi

echo "Done."
