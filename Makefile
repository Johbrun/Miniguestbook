# MiniGuestbook — developer & DevSecOps helper targets
#
# NOTE: the security scanners (semgrep, trivy, gitleaks, checkov, syft) are optional tools.
# Install them locally or run them via their official Docker images. Targets degrade gracefully
# if a tool is missing.

.PHONY: help install lint format test build dev security sast sca secrets iac sbom

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install backend + frontend dependencies
	cd backend && npm install
	cd frontend && npm install

lint: ## Run ESLint + Prettier check on backend + frontend
	cd backend && npm run lint
	cd frontend && npm run lint

format: ## Auto-format backend + frontend
	cd backend && npm run format
	cd frontend && npm run format

test: ## Run backend tests
	cd backend && npm test

build: ## Build backend + frontend
	cd backend && npm run build
	cd frontend && npm run build

dev: ## Reminder on how to run in dev
	@echo "Run 'cd backend && npm run dev' and 'cd frontend && npm run dev' in two terminals."

# ---------------------------------------------------------------------------
# DevSecOps: local security scans (shift-left). Each target is best-effort.
# ---------------------------------------------------------------------------

security: sast sca secrets iac sbom ## Run all local security scans

sast: ## Static analysis (Semgrep + njsscan)
	@command -v semgrep >/dev/null 2>&1 && semgrep --config auto --error || echo "semgrep not installed — skipping"
	@command -v njsscan >/dev/null 2>&1 && njsscan backend || echo "njsscan not installed — skipping"

sca: ## Dependency / supply-chain analysis (npm audit + retire.js + trivy fs)
	-cd backend && npm audit || true
	-cd frontend && npm audit || true
	@command -v retire >/dev/null 2>&1 && retire || echo "retire.js not installed — skipping"
	@command -v trivy >/dev/null 2>&1 && trivy fs --scanners vuln . || echo "trivy not installed — skipping"

secrets: ## Secret scanning (gitleaks)
	@command -v gitleaks >/dev/null 2>&1 && gitleaks detect --no-banner -v || echo "gitleaks not installed — skipping"

iac: ## IaC / config scanning (Checkov + trivy config)
	@command -v checkov >/dev/null 2>&1 && checkov -d . || echo "checkov not installed — skipping"
	@command -v trivy >/dev/null 2>&1 && trivy config . || echo "trivy not installed — skipping"

sbom: ## Generate a CycloneDX SBOM (syft)
	@command -v syft >/dev/null 2>&1 && syft . -o cyclonedx-json=sbom.json && echo "SBOM written to sbom.json" || echo "syft not installed — skipping"
