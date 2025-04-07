#!/bin/bash

execute_migration() {
  MIGRATIONS_DIR="src/migrations"
  QUEUED_DIR="$MIGRATIONS_DIR/queued"
  EXECUTED_DIR="$MIGRATIONS_DIR/executed"
  LOG_FILE="logs/migrations.log"
  ENV_FILE=".env"

  # Check if .env exists
  if [ ! -f "$ENV_FILE" ]; then
    TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S")
    echo "Error: .env file not found."
    echo "- **NODE_ENV**: N/A" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Failed (.env file not found)" >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 1
  fi

  # Load environment variables from .env, exporting them
  set -a # Automatically export all variables assigned using source
  # Source the .env file, filtering out comments and blank lines
  # Ensure multi-line variables in .env are properly quoted (e.g., MY_VAR="line1\nline2")
  source <(grep -v -e '^#' -e '^$' "$ENV_FILE")
  set +a # Stop automatically exporting variables

  # Find the first migration file in the queued directory
  MIGRATION_FILE=$(ls -t "$QUEUED_DIR"/*.js 2>/dev/null | head -n 1)

  if [ -z "$MIGRATION_FILE" ]; then
    echo "WARNING: No queued migration found."
    echo "**WARNING:** No queued migration found." >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 2
  fi

  # Load environment variables & Execute the rollback command
  node "$MIGRATION_FILE"
  STATUS=$?

  TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S")

  if [ $STATUS -eq 0 ]; then
    # Log success
    echo "- **NODE_ENV**: $NODE_ENV" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Success" >> $LOG_FILE
    echo "" >> $LOG_FILE

    echo "Migration executed successfully."

    # Move the file to executed only if NODE_ENV is production
    if [ "$NODE_ENV" == "production" ]; then
      # Prepend execution success comment to the migration file
      sed -i '' "1i\\
// Executed Successfully: $TIMESTAMP
" "$MIGRATION_FILE"

      mv "$MIGRATION_FILE" "$EXECUTED_DIR"
      echo "Migration moved to $EXECUTED_DIR."
    else
      echo "Migration not moved as NODE_ENV is $NODE_ENV."
    fi

  else
    # Log failure
    echo "- **NODE_ENV**: $NODE_ENV" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Failed with code $STATUS" >> $LOG_FILE
    echo "" >> $LOG_FILE

    echo "Migration failed with status code $STATUS."
    exit $STATUS
  fi
}

# Call the function
execute_migration
