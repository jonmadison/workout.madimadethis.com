# Kettlebell Tracker - Deployment Guide

This guide covers how to deploy the Kettlebell Tracker application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Amplify)](#backend-deployment-amplify)
3. [Frontend Deployment (CDK)](#frontend-deployment-cdk)
4. [Adding New Users](#adding-new-users)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- **AWS Account** with appropriate permissions
- **AWS CLI** configured with profile `jon`:
  ```bash
  aws configure --profile jon
  ```
- **Node.js 20+** installed
- **Git** access to both repositories:
  - Main app: `github.com/jonmadison/workout.madimadethis.com`
  - Deployment: `github.com/jonmadison/workout-deployment`

---

## Backend Deployment (Amplify)

The backend (Cognito, DynamoDB, AppSync GraphQL) is deployed automatically via GitHub Actions when changes are pushed to the `amplify/` directory.

### Automated Deployment (Recommended)

1. **Make changes** to backend files in `amplify/` directory
2. **Commit and push** to main branch:
   ```bash
   git add amplify/
   git commit -m "Update Amplify backend configuration"
   git push origin main
   ```
3. **Monitor deployment** at: https://github.com/jonmadison/workout.madimadethis.com/actions
4. **Wait for completion** (~5-10 minutes)
5. **Pull updated config**:
   ```bash
   git pull origin main
   ```

The workflow automatically:
- Deploys backend resources to AWS
- Updates `amplify_outputs.json` with new endpoints
- Commits the updated config back to the repo

### Manual Deployment (Advanced)

If you need to deploy backend changes locally (not recommended):

1. Ensure you have the Amplify App ID:
   ```bash
   # Set as GitHub secret: AMPLIFY_APP_ID
   # Get from AWS Console or:
   aws amplify list-apps --region us-east-1 --profile jon
   ```

2. Deploy via CLI (CI/CD only):
   ```bash
   npx ampx pipeline-deploy --branch main --app-id <YOUR_APP_ID>
   ```

**Note:** This command only works in CI/CD environments (GitHub Actions).

### Testing Backend Locally

To test backend changes without deploying:

```bash
# Validate backend configuration
npx ampx sandbox --once

# This will:
# - Type-check your backend code
# - Synthesize CloudFormation templates
# - Report any errors
# - Exit without deploying
```

---

## Frontend Deployment (CDK)

The frontend (React app) is deployed to S3 + CloudFront using AWS CDK in a separate repository.

### Full Frontend Deployment Process

1. **Build the app** with latest backend config:
   ```bash
   cd /Users/jon/src/ai_projects/workout.madimadethis.com
   npm run build
   ```

2. **Navigate to deployment repo**:
   ```bash
   cd ../workout-deployment
   ```

3. **Run deployment script**:
   ```bash
   ./deploy.sh
   ```

The deploy script will:
- Clone the app repository
- Install dependencies
- Build the React app (includes `amplify_outputs.json`)
- Deploy CDK stack (S3 + CloudFront + Route53)
- Upload build files to S3
- Invalidate CloudFront cache

**Deployment time:** First deploy ~20-30 minutes, subsequent deploys ~5-10 minutes

**CloudFront propagation:** Allow 5-15 minutes for cache invalidation

### What Gets Deployed

- **S3 Bucket:** Static files (HTML, CSS, JS, images)
- **CloudFront Distribution:** Global CDN for fast loading
- **Route53 DNS:** workout.madimadethis.com domain configuration
- **ACM Certificate:** SSL/TLS certificate for HTTPS

---

## Adding New Users

### Option 1: Quick Add Script (Recommended)

Use the convenience script to quickly add users:

```bash
./scripts/add-user.sh user@example.com
```

**What it does:**
1. Finds your Cognito User Pool automatically
2. Generates a secure temporary password (16 characters)
3. Creates the user with verified email
4. Displays credentials to share with the new user

**Example output:**
```
🔍 Finding Cognito User Pool...
✅ Found User Pool: us-east-1_abc123xyz
👤 Creating user: user@example.com

✅ User created successfully!

📧 Email: user@example.com
🔑 Temporary Password: xK9mP2nQ7vR4sT8w

ℹ️  The user must change this password on first login
🌐 Login at: https://workout.madimadethis.com
```

**Requirements:**
- `pwgen-cli` installed (script will install if missing)
- AWS CLI configured with profile `jon`

### Option 2: AWS Console (Manual)

1. **Open AWS Console** → Cognito
2. Navigate to **User Pools** → `kettlebell-tracker-*` pool
3. Click **"Create user"**
4. Fill in:
   - **Email:** user@example.com
   - **Send email invitation:** Yes (recommended)
   - Or set a **temporary password** manually
5. User receives email and sets password on first login

### Option 3: AWS CLI (Manual)

```bash
# Get User Pool ID
AWS_PROFILE=jon aws cognito-idp list-user-pools \
  --max-results 10 \
  --region us-east-1 \
  --query "UserPools[?contains(Name, 'kettlebell')].Id" \
  --output text

# Create user with temporary password
AWS_PROFILE=jon aws cognito-idp admin-create-user \
  --user-pool-id <USER_POOL_ID> \
  --username user@example.com \
  --user-attributes Name=email,Value=user@example.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --region us-east-1 \
  --message-action SUPPRESS
```

### User First Login

New users must:
1. Go to https://workout.madimadethis.com
2. Enter their email and temporary password
3. Set a new permanent password (min 8 characters)
4. Start using the app

**Password Requirements:**
- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character

---

## Troubleshooting

### Backend Deployment Issues

**Problem:** GitHub Actions workflow fails
**Solution:** Check workflow logs at https://github.com/jonmadison/workout.madimadethis.com/actions

**Problem:** "Branch main not found" error
**Solution:**
```bash
aws amplify create-branch \
  --app-id <YOUR_APP_ID> \
  --branch-name main \
  --region us-east-1 \
  --profile jon
```

**Problem:** Permission denied when pushing config
**Solution:** Ensure GitHub secret `GITHUB_TOKEN` has write permissions (should be automatic)

### Frontend Deployment Issues

**Problem:** CloudFront not updating after deployment
**Solution:**
- Wait 5-15 minutes for cache invalidation
- Force browser refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)

**Problem:** Domain not resolving
**Solution:** Check Route53 NS records are delegated in Dreamhost DNS

**Problem:** Build fails with "amplify_outputs.json not found"
**Solution:** Pull latest from main branch first:
```bash
git pull origin main
npm run build
```

### User Management Issues

**Problem:** add-user.sh script not found
**Solution:** Make script executable:
```bash
chmod +x scripts/add-user.sh
```

**Problem:** pwgen command not found
**Solution:** Install pwgen-cli:
```bash
npm install -g pwgen-cli
```

**Problem:** User Pool not found
**Solution:** Ensure backend is deployed and amplify_outputs.json exists

**Problem:** User can't sign in with temporary password
**Solution:**
- Verify email is correct
- Check user was created in Cognito console
- Try resetting password via "Forgot Password" flow

---

## Full Deployment Checklist

When deploying everything from scratch or after major backend changes:

- [ ] **Backend changes** committed to `amplify/` directory
- [ ] **Push to GitHub** to trigger backend deployment
- [ ] **Wait for GitHub Actions** to complete (~5-10 min)
- [ ] **Pull updated** `amplify_outputs.json`
- [ ] **Build React app** with `npm run build`
- [ ] **Deploy frontend** via CDK deployment script
- [ ] **Wait for CloudFront** propagation (~5-15 min)
- [ ] **Test login** at https://workout.madimadethis.com
- [ ] **Add test user** if needed via add-user.sh script

---

## Quick Reference Commands

```bash
# Test backend locally (no deploy)
npx ampx sandbox --once

# Build frontend
npm run build

# Deploy frontend
cd ../workout-deployment && ./deploy.sh

# Add new user
./scripts/add-user.sh user@example.com

# View backend deployment status
open https://github.com/jonmadison/workout.madimadethis.com/actions

# Check Cognito users
AWS_PROFILE=jon aws cognito-idp list-users \
  --user-pool-id <USER_POOL_ID> \
  --region us-east-1
```

---

## Cost Estimates

**Monthly AWS Costs (estimated):**

- **Cognito:** Free (< 50,000 monthly active users)
- **DynamoDB:** ~$0.25 (on-demand pricing, low usage)
- **AppSync:** ~$4 per million queries (likely < $1/month)
- **S3:** ~$0.50 (storage + requests)
- **CloudFront:** ~$1-2 (data transfer)
- **Route53:** ~$0.50 (hosted zone)

**Total: ~$2-5/month** for low to moderate usage

**GitHub Actions:** Free (within 2,000 minutes/month free tier)

---

For developer documentation and technical details, see [CLAUDE_CONTEXT.md](./CLAUDE_CONTEXT.md).
