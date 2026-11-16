#!/usr/bin/env bash

# exitbase
set -eo pipefail

# root path
cd "$(dirname "$0")/.."

# colors
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

# Logging helper functions
log_step() {
    echo -e "${BOLD}${CYAN}==>${RESET} ${BOLD}$1${RESET}"
}

log_info() {
    echo -e "    ${CYAN}•${RESET} $1"
}

log_success() {
    echo -e "    ${GREEN}✓${RESET} $1"
}

log_warn() {
    echo -e "    ${YELLOW}⚠${RESET} $1"
}

log_error() {
    echo -e "    ${RED}✗${RESET} $1"
}

# display
echo -e "${BOLD}${CYAN}"
cat << "EOF"
  ______     _ _   _                    
 |  ____|   (_) | | |                   
 | |__  __  ___| |_| |__   __ _ ___  ___ 
 |  __| \ \/ / | __| '_ \ / _` / __|/ _ \
 | |____ >  <| | |_| |_) | (_| \__ \  __/
 |______/_/\_\_|\__|_.__/ \__,_|___/\___|
             PRODUCTION MODE
EOF
echo -e "${RESET}"

# docker engine and compose installer
log_step "Step 1: Checking Docker prerequisites..."

# Verify the Docker CLI is installed and in the user's PATH
if ! command -v docker >/dev/null 2>&1; then
    log_error "Docker is not installed or not available in PATH."
    log_info "Please install Docker from https://docs.docker.com/engine/install/"
    exit 1
fi
log_success "Docker binary located: $(which docker)"

# Verify Docker Compose V2 is installed
if ! docker compose version >/dev/null 2>&1; then
    log_error "Docker Compose V2 plugin is not found ('docker compose')."
    log_info "Please install the Docker Compose plugin: sudo apt-get install docker-compose-plugin"
    exit 1
fi
COMPOSE_VER=$(docker compose version --short 2>/dev/null || echo "v2+")
log_success "Docker Compose available: Version ${COMPOSE_VER}"

# Verify the Docker daemon service is actively running and responding to pings
if ! docker info >/dev/null 2>&1; then
    log_error "Docker daemon is not running or current user lacks socket permissions."
    log_info "Try starting the Docker service: sudo systemctl start docker"
    log_info "Ensure user is in docker group: sudo usermod -aG docker \$USER && newgrp docker"
    exit 1
fi
log_success "Docker daemon is active and responsive."

# parse target command
ACTION="${1:-up}"

case "$ACTION" in

    # production mode
    up|start)
        log_step "Step 2: Configuring Production Environment (Neon Cloud)..."

        # Ensure .env.production exists with secure credentials
        if [ ! -f .env.production ]; then
            log_warn "Missing .env.production file. Checking for example template..."
            if [ -f .env.production.example ]; then
                cp .env.production.example .env.production
                log_warn "Created .env.production template. Please update with your real production Neon Cloud connection string."
            else
                log_error "Production environment configuration (.env.production) is missing."
                log_info "Create .env.production with your production DATABASE_URL and JWT_SECRET."
                exit 1
            fi
        else
            log_success "Environment file .env.production verified."
        fi

        log_step "Step 3: Building and deploying production container..."
        # Build production stage with multi-stage caching and run detached
        docker compose -f docker-compose.prod.yml up -d --build

        log_step "Step 4: Verifying container health status..."
        # Short pause to let Node.js bootstrap and open HTTP server
        sleep 3
        docker compose -f docker-compose.prod.yml ps

        log_success "Exitbase production backend is now running in background."
        log_info "View real-time logs with: ./script/prod.sh logs"
        log_info "Stop container with      : ./script/prod.sh down"
        ;;

    # db migration
    migrate)
        log_step "Step 2: Executing database migrations..."
        if [ ! -f .env.production ]; then
            log_error "Missing .env.production. Cannot determine target database connection string."
            exit 1
        fi

        log_info "Running 'npm run db:migrate' via one-shot container..."
        docker compose -f docker-compose.prod.yml run --rm migrator
        log_success "Database schema migrations applied successfully."
        ;;

    # cleanup
    down|stop)
        log_step "Stopping Exitbase production containers..."
        docker compose -f docker-compose.prod.yml down --remove-orphans
        log_success "Exitbase production containers stopped."
        ;;

    # live logs
    logs)
        log_info "Streaming production logs (press Ctrl+C to exit)..."
        exec docker compose -f docker-compose.prod.yml logs -f app
        ;;

    # help
    help|--help|-h)
        echo "Exitbase Production Script"
        echo ""
        echo "Usage: ./script/prod.sh [up|migrate|down|logs]"
        ;;

    # invalid command
    *)
        log_error "Unrecognized command: '$ACTION'"
        echo "Usage: ./script/prod.sh [up|migrate|down|logs]"
        exit 1
        ;;
esac
