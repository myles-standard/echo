#!/bin/sh
set -eu

if [ "$#" -eq 0 ]; then
    printf 'Choose a migration action: create, up, or down: ' >&2
    if ! IFS= read -r action; then
        printf '\nNo migration action provided.\n' >&2
        exit 1
    fi
else
    action=$1
    shift
fi

case "$action" in
    create) migration_script=migrate:create ;;
    up) migration_script=migrate:up ;;
    down) migration_script=migrate:down ;;
    *)
        printf 'Invalid migration action: %s. Use create, up, or down.\n' "$action" >&2
        exit 1
        ;;
esac

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
tty_option=
if [ ! -t 0 ] || [ ! -t 1 ]; then
    tty_option=-T
fi

exec docker compose -f "$script_dir/docker-compose.yml" exec ${tty_option:+"$tty_option"} app npm run "$migration_script" -- "$@"
