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
AWS_REGION="${AWS_REGION:-us-east-1}"

# Check if pwgen is available
if ! command -v pwgen &> /dev/null; then
  echo "Error: pwgen not found. Installing..."
  npm install -g pwgen-cli
fi

echo "🔍 Finding Cognito User Pool..."

# Get User Pool ID
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 --region "$AWS_REGION" --profile "$AWS_PROFILE" \
  --query "UserPools[?Name=='*kettlebell*'].Id | [0]" --output text)

if [ -z "$USER_POOL_ID" ] || [ "$USER_POOL_ID" = "None" ]; then
  echo "❌ Error: Could not find Cognito User Pool"
  echo "   Make sure your Amplify backend is deployed"
  exit 1
fi

echo "✅ Found User Pool: $USER_POOL_ID"

# Generate temporary password
TEMP_PASSWORD=$(pwgen -s 16 1)

echo "👤 Creating user: $EMAIL"

# Create user
aws cognito-idp admin-create-user \
  --user-pool-id "$USER_POOL_ID" \
  --username "$EMAIL" \
  --user-attributes Name=email,Value="$EMAIL" Name=email_verified,Value=true \
  --temporary-password "$TEMP_PASSWORD" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" \
  --message-action SUPPRESS

echo ""
echo "✅ User created successfully!"
echo ""
echo "📧 Email: $EMAIL"
echo "🔑 Temporary Password: $TEMP_PASSWORD"
echo ""
echo "ℹ️  The user must change this password on first login"
echo "🌐 Login at: https://workout.madimadethis.com"
