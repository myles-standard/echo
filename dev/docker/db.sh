#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

tty_option=
if [ ! -t 0 ] || [ ! -t 1 ]; then
    tty_option=-T
fi

exec docker compose -f "$script_dir/docker-compose.yml" exec ${tty_option:+"$tty_option"} db sh -c '
    : "${POSTGRES_USER:?POSTGRES_USER is not set}"
    : "${POSTGRES_DB:?POSTGRES_DB is not set}"
    exec psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@"
' sh "$@"
