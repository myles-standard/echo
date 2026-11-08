#!/bin/sh
set -eu

show_help_if_requested() {
    for arg do
        case "$arg" in
            -h|--help)
                cat <<'EOF'
Usage: install.sh [docker compose up options]

Start the Echo application and database in the background with Docker Compose.
Options can also be supplied as whitespace-separated words on stdin.
Stdin does not interpret shell quoting or expressions.

Examples:
  ./dev/docker/install.sh
  ./dev/docker/install.sh --build
  printf '%s\n' '--build' | ./dev/docker/install.sh
  ./dev/docker/log.sh --follow

Create dev/docker/.env with POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB,
and NODE_ENV before starting the project. Use -h or --help to show this help.
EOF
                return 0
                ;;
        esac
    done
    return 1
}

if show_help_if_requested "$@"; then
    exit 0
fi

if [ ! -t 0 ]; then
    set -f
    while IFS= read -r line || [ -n "$line" ]; do
        # Stdin accepts whitespace-separated arguments, not shell expressions.
        set -- "$@" $line
    done
    set +f
fi

if show_help_if_requested "$@"; then
    exit 0
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec docker compose -f "$script_dir/docker-compose.yml" up -d "$@"
