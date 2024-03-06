.PHONY: up
up:
	docker compose up -d

.PHONY: down
down:
	docker compose down

.PHONY: logs
logs:
	docker compose logs -f

.PHONY: build
build:
	docker compose build --no-cache

.PHONY: server
server:
	docker compose run --rm -u=0:0 server bash

.PHONY: client
client:
	docker compose run --rm -u=0:0 client bash

.PHONY: bundle_update
bundle_update:
	docker compose run --rm -u=0:0 server sh -c "bundle config set frozen false && bundle i"