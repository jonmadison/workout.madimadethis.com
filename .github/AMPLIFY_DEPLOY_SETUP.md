# Amplify Backend GitHub Actions Setup

## Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### 1. AWS_ACCESS_KEY_ID
Your AWS access key for the `jon` profile.

**How to get it:**
```bash
# Check your AWS credentials file
cat ~/.aws/credentials | grep -A 2 "\[jon\]"
```

Copy the `aws_access_key_id` value.

### 2. AWS_SECRET_ACCESS_KEY
Your AWS secret access key for the `jon` profile.

Copy the `aws_secret_access_key` value from the same location.

### 3. AMPLIFY_APP_ID
The Amplify app ID (created below).

---

## Setup Steps

### Step 1: Create Amplify App (One-Time)

```bash
# Create the Amplify app container
AWS_PROFILE=jon aws amplify create-app \
  --name kettlebell-tracker \
  --region us-east-1 \
  --platform WEB

# Output will include:
# "appId": "xxxxxxxxxxxx"
```

**Copy the `appId` value** - you'll need it for GitHub secrets.

### Step 2: Add GitHub Secrets

1. Go to: https://github.com/jonmadison/workout.madimadethis.com/settings/secrets/actions
2. Click "New repository secret" for each:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `AMPLIFY_APP_ID` | The appId from Step 1 |

### Step 3: Commit and Push Workflow

```bash
git add .github/
git commit -m "Add GitHub Actions workflow for Amplify backend deployment"
git push origin main
```

### Step 4: Trigger First Deployment

**Option A: Manual Trigger**
1. Go to: https://github.com/jonmadison/workout.madimadethis.com/actions
2. Click "Deploy Amplify Backend"
3. Click "Run workflow" → Select `main` → "Run workflow"

**Option B: Push Changes**
```bash
# Make any change to amplify/ directory
touch amplify/data/resource.ts
git add .
git commit -m "Trigger backend deployment"
git push origin main
```

---

## How It Works

**Triggers:**
- Automatically runs when you push changes to `amplify/**` on main branch
- Can be manually triggered from GitHub Actions UI

**What It Does:**
1. Checks out code
2. Installs dependencies
3. Configures AWS credentials
4. Runs `npx ampx pipeline-deploy`
5. Commits updated `amplify_outputs.json` back to repo (if changed)

**Safety Features:**
- `[skip ci]` in commit message prevents infinite loops
- Only runs on main branch
- Only runs when amplify files change
- Prevents concurrent deployments

**Cost:**
- ~3-5 minutes per deployment
- Free tier: 2,000 minutes/month
- Typical usage: <50 minutes/month = **$0**

---

## Troubleshooting

**Workflow fails with "Missing app-id":**
- Check that `AMPLIFY_APP_ID` secret is set correctly
- Verify app exists: `AWS_PROFILE=jon aws amplify list-apps --region us-east-1`

**Workflow fails with "AccessDenied":**
- Check AWS credentials are correct
- Ensure IAM user has Amplify permissions

**Workflow doesn't trigger:**
- Check that changes were made to `amplify/**` directory
- Or use manual trigger from GitHub Actions UI

---

## Future Deployments

After initial setup, deployments are automatic:

1. Make changes to `amplify/data/resource.ts` locally
2. Commit and push to main
3. GitHub Actions automatically deploys backend
4. Updated `amplify_outputs.json` is committed back
5. Pull latest and run `npm run build` to include new config
6. Deploy frontend: `cd ../workout-deployment && ./deploy.sh`
