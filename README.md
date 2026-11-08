# echo
Echo is an improved playlist generator for your Spotify account.

## Run with Docker

Install Docker with the Compose plugin, and create `dev/docker/.env` with
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `NODE_ENV` values.
Then run:

```sh
./dev/docker/install.sh --build
```

The script starts the database and application in the background using Docker
Compose. Options are passed to `docker compose up`. You can also supply
whitespace-separated options through stdin:

```sh
printf '%s\n' '--build' | ./dev/docker/install.sh
```

Options supplied as command-line arguments retain their shell quoting; stdin
does not interpret shell quoting or expressions. The application is available
at <http://localhost:5000>.

Run `./dev/docker/install.sh --help` for usage and more examples.

After installing, stop and start the existing service containers with:

```sh
./dev/docker/stop.sh
./dev/docker/start.sh
./dev/docker/start.sh -r
```

Use `-r` as the first argument to restart services instead of starting them.
Both scripts accept service names and options for their respective Docker
Compose commands. Starting or restarting does not rebuild or recreate
containers; use the install script when needed.

View logs for both services, or follow a specific service:

```sh
./dev/docker/log.sh
./dev/docker/log.sh --follow app
```

The log script forwards arguments to `docker compose logs`; use
`./dev/docker/log.sh --help` for available options.

Open a shell in the running app container, or pass commands through stdin:

```sh
./dev/docker/bash.sh
printf '%s\n' 'pwd' 'ls' | ./dev/docker/bash.sh
./dev/docker/bash.sh -c 'pwd'
```

The script uses `sh`, which is available in the Alpine-based app image, and
passes command-line arguments to it. Start the app before using the shell.

Connect to the running database with `psql`, or pass it options and SQL:

```sh
./dev/docker/db.sh
./dev/docker/db.sh -c 'SELECT version();'
printf '%s\n' 'SELECT version();' | ./dev/docker/db.sh
```

The script uses the database container's `POSTGRES_USER` and `POSTGRES_DB` by
default. Additional arguments are forwarded to `psql` and can override its
connection options. The database service must be running.

Run migrations from the running app container:

```sh
./dev/docker/migrate.sh create initial  # Create a migration
./dev/docker/migrate.sh up              # Apply migrations
./dev/docker/migrate.sh down            # Roll back a migration
```

The script prompts for `create`, `up`, or `down` if no action is provided. Additional
arguments are forwarded to the corresponding migration command. Creating a
migration requires a name; up and down require a running database.
