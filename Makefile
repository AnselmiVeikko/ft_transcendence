# Makefile for Docker Compose

# File docker-compose
DC=docker-compose
ENV_FILE=.env
COMPOSE_FILE=docker-compose.yml

# Services
SERVICES=game frontend backend

# -----------------------
# Build all images or a single image
# Usage:
# - Build all images: make build
# - Build a single image: make build SERVICE=game
# -----------------------
build:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Building all services..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) build; \
	else \
		echo "Building service $(SERVICE)..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) build $(SERVICE); \
	fi

# -----------------------
# Start all services or a single service
# Usage:
# - Start all services: make up
# - Statt a single service: make up SERVICE=game
# -----------------------
up:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Starting all services..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) up -d; \
	else \
		echo "Starting service $(SERVICE)..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) up -d $(SERVICE); \
	fi

# -----------------------
# Stop all services or a single service
# Usage:
# - Stop all services: make stop
# - Stop a single service: make stop SERVICE=game
# -----------------------
stop:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Stopping all services..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) stop; \
	else \
		echo "Stopping service $(SERVICE)..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) stop $(SERVICE); \
	fi

# -----------------------
# Remove all services or a single service
# Usage:
# - Remove all services: make rm
# - Remove a single service: make rm SERVICE=game
# -----------------------
rm:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Removing all services..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) rm -f; \
	else \
		echo "Removing service $(SERVICE)..."; \
		$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) rm -f $(SERVICE); \
	fi
	
# -----------------------
# Clean everything: containers, networks, volumes
# -----------------------
clean:
	@echo "Stopping and removing all containers, networks, and volumes..."
	@docker stop $$(docker ps -aq) 2>/dev/null || true
	@echo "Stopped all containers"
	@docker compose down --volumes --rmi all --remove-orphans
	@docker builder prune -f
	@docker volume prune -f
	@echo "Removed all containers, networks, and volumes..."

# -----------------------
# Logs
# -----------------------
logs:
	@echo "Tailing logs..."
	$(DC) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) logs -f

# -----------------------
# Build and start all services
# Usage:
# - make run
# -----------------------
run:
	@echo "Building all services..."
	$(MAKE) build
	@echo "Starting all services..."
	$(MAKE) up

# -----------------------
# Clean, build and restart
# -----------------------
re:
	@echo "Cleaning and restarting all services..."
	$(MAKE) stop
	$(MAKE) clean
	$(MAKE) build
	$(MAKE) up
