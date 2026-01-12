#!/bin/bash
set -e

# Add user to Cognito User Pool
# Usage: ./scripts/add-user.sh user@example.com

if [ -z "$1" ]; then
  echo "Usage: ./scripts/add-user.sh <email>"
  echo "Example: ./scripts/add-user.sh user@example.com"
  exit 1
fi

EMAIL="$1"
AWS_PROFILE="${AWS_PROFILE:-jon}"

# Check if pwgen is available
if ! command -v pwgen &> /dev/null; then
  echo "Error: pwgen not found. Installing..."
  npm install -g pwgen-cli
fi

echo "🔍 Finding Cognito User Pool..."

# Get User Pool ID from amplify_outputs.json
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AMPLIFY_OUTPUTS="$PROJECT_ROOT/amplify_outputs.json"

if [ ! -f "$AMPLIFY_OUTPUTS" ]; then
  echo "❌ Error: amplify_outputs.json not found at $AMPLIFY_OUTPUTS"
  echo "   Make sure your Amplify backend is deployed"
  exit 1
fi

# Extract user_pool_id and aws_region using grep and sed (no jq required)
USER_POOL_ID=$(grep -o '"user_pool_id": *"[^"]*"' "$AMPLIFY_OUTPUTS" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
AWS_REGION=$(grep -o '"aws_region": *"[^"]*"' "$AMPLIFY_OUTPUTS" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')

if [ -z "$USER_POOL_ID" ]; then
  echo "❌ Error: Could not find user_pool_id in amplify_outputs.json"
  echo "   Make sure your Amplify backend is deployed correctly"
  exit 1
fi

if [ -z "$AWS_REGION" ]; then
  echo "⚠️  Warning: Could not find aws_region in amplify_outputs.json, using default: us-east-1"
  AWS_REGION="us-east-1"
fi

echo "✅ Found User Pool: $USER_POOL_ID"

# Generate temporary password
TEMP_PASSWORD=$(pwgen --length 16 --count 1 --lowercase --uppercase --numbers --symbols --raw --no-copy --no-banner 2>&1)

if [ -z "$TEMP_PASSWORD" ]; then
  echo "❌ Error: Failed to generate password"
  exit 1
fi

echo "👤 Creating user: $EMAIL"

# Create user
aws cognito-idp admin-create-user \
  --user-pool-id "$USER_POOL_ID" \
  --username "$EMAIL" \
  --user-attributes Name=email,Value="$EMAIL" Name=email_verified,Value=true \
  --temporary-password "$TEMP_PASSWORD" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" \
  --message-action SUPPRESS \
  --output json > /dev/null

echo ""
echo "✅ User created successfully!"
echo ""
echo "📧 Email: $EMAIL"
echo "🔑 Temporary Password: $TEMP_PASSWORD"
echo ""
echo "ℹ️  The user must change this password on first login"
echo "🌐 Login at: https://workout.madimadethis.com"
