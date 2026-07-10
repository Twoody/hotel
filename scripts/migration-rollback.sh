#!/bin/bash

rollback_migration() {
  MIGRATIONS_DIR="src/migrations"
  QUEUED_DIR="$MIGRATIONS_DIR/queued"
  EXECUTED_DIR="$MIGRATIONS_DIR/executed"
  LOG_FILE="logs/migrations.log"
  ENV_FILE=".env"

  mkdir -p logs

  # Check for .env file
  if [ ! -f "$ENV_FILE" ]; then
    TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S")
    echo "Error: .env file not found."
    echo "- **NODE_ENV**: N/A" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Failed (.env file not found)" >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 1
  fi

  # Load environment variables from .env, exporting them (same as migration-run.sh)
  set -a
  source "$ENV_FILE"
  set +a

  # Validate input
  if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ Error: Usage: ./scripts/migration-rollback.sh <migration_file.js> <migration_id>"
    exit 1
  fi

  MIGRATION_NAME=$(basename "$1")
  MIGRATION_ID=$2

  # Look in executed/ first (rollbacks target migrations that ran), then queued/
  MIGRATION_FILE=""
  for dir in "$EXECUTED_DIR" "$QUEUED_DIR"; do
    if [ -f "$dir/$MIGRATION_NAME" ]; then
      MIGRATION_FILE="$dir/$MIGRATION_NAME"
      break
    fi
  done

  if [ -z "$MIGRATION_FILE" ]; then
    echo "❌ Error: '$MIGRATION_NAME' not found in $EXECUTED_DIR or $QUEUED_DIR."
    echo "**WARNING:** Rollback failed: '$MIGRATION_NAME' not found." >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 2
  fi

  node "$MIGRATION_FILE" --rollback "$MIGRATION_ID"
  STATUS=$?

  TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S")

  if [ $STATUS -eq 0 ]; then
    echo "- **NODE_ENV**: $NODE_ENV" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Rollback Success" >> $LOG_FILE
    echo "" >> $LOG_FILE
    echo "Rollback completed successfully."
  else
    echo "- **NODE_ENV**: $NODE_ENV" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Rollback Failed with code $STATUS" >> $LOG_FILE
    echo "" >> $LOG_FILE
    echo "Rollback failed with status code $STATUS."
    exit $STATUS
  fi
}

# Call the main function
# @example `npm run migrate:rollback migration_2025-04-04T05:49:30Z.js migration_v2_1700000000000`
rollback_migration "$@"
