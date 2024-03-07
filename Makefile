.PHONY: up
up:
	docker compose --profile dev up -d

.PHONY: down
down:
	docker compose --profile dev down

.PHONY: logs
logs:
	docker compose --profile dev logs -f

.PHONY: build
build:
	docker compose build --profile dev --no-cache

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
	git pull -f
	docker compose down
	docker compose run --rm -u=0:0 server sh -c "bundle config set frozen false && bundle i"
	docker compose build --no-cache
	docker compose run --rm -u=0:0 server sh -c "bundle exec rails db:migrate"
	docker compose up -d