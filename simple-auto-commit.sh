#!/bin/bash

# Jednoduchý auto-commit script
echo "🔄 Starting auto-commit monitor..."

while true; do
    echo "🔍 Checking for changes at $(date '+%H:%M:%S')..."
    
    # Check if there are any changes
    if [[ -n "$(git status --porcelain)" ]]; then
        echo "📝 Changes detected, committing..."
        
        # Add all changes
        git add .
        
        # Create timestamp
        TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
        
        # Commit with timestamp
        git commit -m "Auto-save: $TIMESTAMP" --no-verify
        
        echo "✅ Changes committed at $TIMESTAMP"
    else
        echo "✨ No changes to commit"
    fi
    
    # Wait 2 minutes before next check
    echo "⏱️  Waiting 2 minutes..."
    sleep 120
done
