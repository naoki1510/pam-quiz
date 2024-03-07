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

.PHONY: api
api:
	docker compose run --rm -u=0:0 api bash

.PHONY: client
client:
	docker compose run --rm -u=0:0 client bash

.PHONY: bundle_update
bundle_update:
	docker compose run --rm -u=0:0 api sh -c "bundle config set frozen false && bundle i"

.PHONY: db_create
db_create:
	docker compose run --rm -u=0:0 api sh -c "bundle exec rails db:create"

.PHONY: db_migrate
db_migrate:
	docker compose run --rm -u=0:0 api sh -c "bundle exec rails db:migrate"

.PHONY: production_deploy
production_deploy:
	git fetch origin main
	git reset --hard origin/main
	docker compose down
	make bundle_update
	make db_migrate
	docker compose up -d