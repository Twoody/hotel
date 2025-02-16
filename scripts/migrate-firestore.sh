#!/bin/bash

setup_migrate_firestore() {
  # Path to the template file
  TEMPLATE_FILE="src/migrations/template.js"

  # Path to the queued directory
  QUEUED_DIR="src/migrations/queued"

  # Check if the template file exists
  if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template file not found at $TEMPLATE_FILE"
    return 1
  fi

  # Check if the queued directory exists
  if [ ! -d "$QUEUED_DIR" ]; then
    echo "Error: Queued directory not found at $QUEUED_DIR"
    return 1
  fi

  # Get the current ISO8601 timestamp (UTC)
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  # Construct the destination path
  DEST_FILE="${QUEUED_DIR}/migration_${TIMESTAMP}.js"

  # Copy the template to the new migration file
  cp "$TEMPLATE_FILE" "$DEST_FILE"

  echo "Migration created: $DEST_FILE"
  return 0
}

# Call the function
setup_migrate_firestore
