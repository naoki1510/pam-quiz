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

.PHONY: production_deploy
production_deploy:
	docker compose -f compose.prod.yaml down
	docker compose -f compose.prod.yaml run --rm -u=0:0 server sh -c "bundle config set frozen false && bundle i"
	docker compose -f compose.prod.yaml build --no-cache
	docker compose -f compose.prod.yaml run --rm -u=0:0 server sh -c "bundle exec rails db:migrate"
	docker compose -f compose.prod.yaml up -d