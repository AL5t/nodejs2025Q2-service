#!/bin/sh

echo "Waiting for db ..."

until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done

echo "Running migration ..."
npm run migration:run:prod

exec "$@"