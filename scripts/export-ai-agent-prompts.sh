#!/bin/bash

set -e

# Ensure GitHub CLI is authenticated
if ! gh auth status &>/dev/null; then
  echo "❌ GitHub CLI not authenticated. Run: gh auth login"
  exit 1
fi

# Get current branch and repo name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
REPO_NAME=$(gh repo view --json nameWithOwner -q '.nameWithOwner')

# Find PR number for this branch
PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number -q '.[0].number')
if [ -z "$PR_NUMBER" ]; then
  echo "❌ No pull request found for branch '$BRANCH_NAME'"
  exit 1
fi

echo "🔍 Found PR #$PR_NUMBER for branch '$BRANCH_NAME'"

# Temporary file for review-inline-comments
TMP_FILE=$(mktemp)

echo "📥 Fetching review-inline-comments..."
gh api "repos/$REPO_NAME/pulls/$PR_NUMBER/comments" > "$TMP_FILE"

# Output filename includes PR number
OUTPUT_FILE="ai-agent-prompts-pr-${PR_NUMBER}.json"

echo "📦 Filtering and extracting AI agent prompts..."

jq -r '
  map(select(.user.login == "coderabbitai[bot]")) |
  map({
    path,
    line,
    body
  })' "$TMP_FILE" | jq -c '.[]' | while read -r comment; do
  path=$(echo "$comment" | jq -r '.path')
  line=$(echo "$comment" | jq -r '.line')
  body=$(echo "$comment" | jq -r '.body')

  # Extract the block between <summary>🤖 Prompt for AI Agents</summary> and </details>
  prompt=$(echo "$body" \
    | sed -n '/<summary>🤖 Prompt for AI Agents<\/summary>/,/<\/details>/p' \
    | sed '1d;$d' \
    | sed '/^```/d')

  if [ -n "$prompt" ]; then
    # Trim whitespace
    prompt=$(echo "$prompt" | sed 's/^[ \t]*//' | sed 's/[ \t]*$//')

    jq -n \
      --arg path "$path" \
      --argjson line "$line" \
      --arg prompt "$prompt" \
      '{path: $path, line: $line, prompt: $prompt, agree: null, reply: null}'
  fi
done | jq -s '.' > "$OUTPUT_FILE"

rm "$TMP_FILE"

echo "✅ Prompts saved to $OUTPUT_FILE"
