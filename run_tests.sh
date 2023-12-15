#!/bin/bash

# Build images
docker-compose -f docker-compose.dev.yml build

# Run the tests
# docker-compose -f docker-compose.dev.yml run --rm fast_api pytest test_main.py

# For No pytest warnings
# docker-compose -f docker-compose.dev.yml run fast_api pytest -p no:warnings test_main.py
docker-compose -f docker-compose.dev.yml run fast_api pytest -p no:warnings tests

# If fast_api finishes running (regardless of test result), stop all services
docker-compose -f docker-compose.dev.yml down

