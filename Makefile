.PHONY: help install test lint format check run clean

PM := npm

help:
	@echo "Targets:"
	@echo "  install   Install dependencies"
	@echo "  test      Run tests"
	@echo "  lint      Run linter"
	@echo "  format    Run formatter"
	@echo "  check     Lint + test (CI-style)"
	@echo "  run       Run the application"
	@echo "  clean     Remove build / cache artefacts"

install:
	$(PM) install

test:
	$(PM) test

lint:
	$(PM) run lint

format:
	$(PM) run format

check: lint test

run:
	$(PM) start

clean:
	rm -rf dist/ build/ coverage/ .turbo/ .next/ .vite/
