#!/bin/bash

set -e

# Input and output
INPUT_FILE="pr-*-comments/review-inline-comments.json"
OUTPUT_FILE="ai-agent-prompts.json"

if [ ! -f $INPUT_FILE ]; then
  echo "❌ Could not find $INPUT_FILE"
  exit 1
fi

echo "📦 Processing $INPUT_FILE..."

jq -r '
  map(select(.user.login == "coderabbitai[bot]")) |
  map({
    path,
    line,
    body
  })' "$INPUT_FILE" | jq -c '.[]' | while read -r comment; do
  # Parse each comment
  path=$(echo "$comment" | jq -r '.path')
  line=$(echo "$comment" | jq -r '.line')
  body=$(echo "$comment" | jq -r '.body')

  # Extract content between <summary>🤖 Prompt for AI Agents</summary> and </details>
  prompt=$(echo "$body" | sed -n '/<summary>🤖 Prompt for AI Agents<\/summary>/,/<\/details>/p' | sed '1d;$d' | sed '/^```/d')

  if [ -n "$prompt" ]; then
    # Clean leading/trailing whitespace
    prompt=$(echo "$prompt" | sed 's/^[ \t]*//' | sed 's/[ \t]*$//')

    # Add to array
    jq -n \
      --arg path "$path" \
      --arg line "$line" \
      --arg prompt "$prompt" \
      '{path: $path, line: ($line | tonumber), prompt: $prompt}'
  fi
done | jq -s '.' > "$OUTPUT_FILE"

echo "✅ Prompts saved to $OUTPUT_FILE"
