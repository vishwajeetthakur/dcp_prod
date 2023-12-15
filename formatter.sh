#!/bin/bash

# Define the directory containing the Python files
DIRECTORY="backend/app"

# autoflake for removing unused imports
echo "Running autoflake..."
autoflake --in-place --remove-all-unused-imports --recursive $DIRECTORY

# isort for sorting imports
echo "Running isort..."
isort $DIRECTORY

# autopep8 for formatting code according to PEP8
echo "Running autopep8..."
autopep8 --in-place --recursive --aggressive --aggressive $DIRECTORY

echo "Running black for formatting long lines"
black --line-length 90 backend/app/

# flake8 for checking compliance with .flake8 configuration
echo "Running flake8..."
flake8 --config=$DIRECTORY/.flake8 $DIRECTORY
