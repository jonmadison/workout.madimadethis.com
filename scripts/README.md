# User Management Scripts

Scripts to manually manage users in Cognito User Pool.

## Prerequisites

Install AWS SDK:
```bash
npm install @aws-sdk/client-cognito-identity-provider
```

## Scripts

### 1. Create User

Creates a new user with a temporary password.

**Note:** This app uses email-based login. The username should be an email address.

```bash
node scripts/create-user.js <email> <email> [firstName]
```

**Example:**
```bash
node scripts/create-user.js alice@example.com alice@example.com Alice
```

**Output:**
- Username: alice@example.com
- Email: alice@example.com
- Temporary Password: TempPassword123!
- User will be prompted to change password on first login

### 2. Set Permanent Password

Sets a permanent password for a user (skips temporary password flow).

```bash
node scripts/set-user-password.js <email> <password>
```

**Example:**
```bash
node scripts/set-user-password.js alice@example.com MyPassword123!
```

**Output:**
- User can immediately log in with the new password
- No password change required

## Complete Flow

To create a user with a permanent password:

```bash
# Step 1: Create the user
node scripts/create-user.js alice@example.com alice@example.com Alice

# Step 2: Set a permanent password
node scripts/set-user-password.js alice@example.com MyPassword123!
```

Now the user can log in with `alice@example.com` / `MyPassword123!`

## Configuration

Users are created in the Cognito User Pool defined in `amplify_outputs.json`.

### Enable/Disable Public Signups

Edit `.env.local`:
```bash
# Disable public signups (default)
VITE_ALLOW_SIGNUPS=false

# Enable public signups
VITE_ALLOW_SIGNUPS=true
```

## Password Requirements

Passwords must meet Cognito requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

## Notes

- Scripts automatically read User Pool ID from `amplify_outputs.json`
- AWS credentials must be configured (uses AWS profile from environment)
- Use `AWS_PROFILE=jon node scripts/create-user.js ...` if needed
- **Important:** Username must be an email address since the app uses email-based login
