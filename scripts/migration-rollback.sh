#!/bin/bash

rollback_migration() {
  MIGRATIONS_DIR="src/migrations"
  QUEUED_DIR="$MIGRATIONS_DIR/queued"
  LOG_FILE="logs/migrations.log"
  ENV_FILE=".env"

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

  # Validate input for migration ID
  if [ -z "$1" ]; then
    echo "❌ Error: No migration ID provided for rollback."
    echo "Usage: ./scripts/migration-rollback.sh <migration_id>"
    exit 1
  fi

  MIGRATION_ID=$1
  MIGRATION_FILE=$(ls -t "$QUEUED_DIR"/*.js 2>/dev/null | head -n 1)

  if [ -z "$MIGRATION_FILE" ]; then
    echo "No queued migration found."
    echo "**WARNING:** No queued migration found." >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 2
  fi

  # Load environment variables & Execute the rollback command
  npx dotenv -- node "$MIGRATION_FILE" --rollback "$MIGRATION_ID"
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
# @example `npm run migrate:rollback migration_v2_1700000000000`
rollback_migration "$@"
