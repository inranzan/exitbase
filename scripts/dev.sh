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
             DEVELOPMENT MODE
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

    # dev mode (neon local)
    up|start)
        log_step "Step 2: Configuring Development Environment (Neon Local)..."

        # Check if .env.development exists; if not, bootstrap it automatically from template
        if [ ! -f .env.development ]; then
            log_warn "Missing .env.development file. Bootstrapping from template..."
            if [ -f .env.development.example ]; then
                cp .env.development.example .env.development
                log_success "Created .env.development from .env.development.example"
            elif [ -f .env.example ]; then
                cp .env.example .env.development
                log_success "Created .env.development from .env.example"
            else
                log_error "No template file found (.env.example or .env.development.example)."
                exit 1
            fi
        else
            log_success "Environment file .env.development verified."
        fi

        # Check for placeholder API keys in development configuration
        if grep -q "napi_sample" .env.development 2>/dev/null || grep -q "sample-project-id" .env.development 2>/dev/null; then
            log_warn "Notice: .env.development currently contains placeholder Neon credentials."
            log_info "To enable automatic ephemeral branch creation, set your real NEON_API_KEY and NEON_PROJECT_ID."
            log_info "Location: .env.development"
        fi

        log_step "Step 3: Building and starting containers (App + Neon Local proxy)..."
        log_info "Application Port : http://localhost:5000"
        log_info "Healthcheck      : http://localhost:5000/health"
        log_info "Database Host    : neon-local:5432 (inside container network)"
        log_info "Code Watch Mode  : Active (node --watch ./src/index.js)"
        echo ""

        # Launch Docker Compose with active rebuild to ensure up-to-date dependencies
        exec docker compose -f docker-compose.dev.yml up --build
        ;;

    # cleanup
    down|stop)
        log_step "Stopping Exitbase dev containers and cleaning ephemeral resources..."
        docker compose -f docker-compose.dev.yml down --remove-orphans
        log_success "Exitbase dev containers stopped."
        ;;

    # live logs
    logs)
        log_info "Streaming development logs (press Ctrl+C to exit)..."
        exec docker compose -f docker-compose.dev.yml logs -f app
        ;;

    # help
    help|--help|-h)
        echo "Exitbase Development Script"
        echo ""
        echo "Usage: ./script/dev.sh [up|down|logs]"
        ;;

    # invalid command
    *)
        log_error "Unrecognized command: '$ACTION'"
        echo "Usage: ./script/dev.sh [up|down|logs]"
        exit 1
        ;;
esac
