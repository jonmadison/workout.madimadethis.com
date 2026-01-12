# Kettlebell Tracker - LLM Context Documentation

## Project Overview
A React + Vite workout tracker app for kettlebell workouts with real-time rest timers and progress tracking. Deployed at https://workout.madimadethis.com

**Key Features:**
- Workout routine display with exercise images
- Active workout session with set tracking
- Circular progress rest timer
- Mobile-first responsive design
- Fixed bottom buttons for always-accessible controls

## Tech Stack
- **Frontend**: React 19.2.0 + Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18 with @tailwindcss/postcss
- **Font**: Nunito (Google Fonts, weight 200-800)
- **Backend**: AWS Amplify Gen 2 (Cognito, DynamoDB, AppSync GraphQL)
- **Frontend Deployment**: AWS CDK (separate repo)
- **Backend Deployment**: Amplify CLI (npx ampx)

## Repository Structure

### Main App Repo
**URL**: https://github.com/jonmadison/workout.madimadethis.com

```
kettlebell-tracker/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App title and workout subtitle
│   │   ├── Workout.jsx         # Scrollable exercise list (home)
│   │   ├── Controls.jsx        # Fixed bottom "Start Workout" button
│   │   ├── WorkoutSession.jsx  # Active workout view
│   │   └── RestTimer.jsx       # Circular countdown timer
│   ├── data/
│   │   └── workoutRoutine.json # Workout configuration
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles + Tailwind
│   └── main.jsx                # App entry point
├── public/
│   └── images_exercises/       # Exercise images (240px max-width)
└── package.json
```

### Deployment Repo
**URL**: https://github.com/jonmadison/workout-deployment
- CDK infrastructure for S3 + CloudFront + Route53
- Uses `AWS_PROFILE=jon`
- Domain: workout.madimadethis.com (subdomain delegated from Dreamhost DNS)

## Component Architecture

### Home Screen (Not Active Workout)
```jsx
<div className="h-full flex flex-col">
  <Header title="..." subtitle="..." />
  <Workout exercises={[...]} />
  <Controls onStartWorkout={fn} />
</div>
```

**Layout Pattern:**
- Container: `h-full flex flex-col` (takes full viewport height)
- Header: Fixed at top with `flex-shrink-0`
- Workout: Scrollable middle with `flex-1 overflow-y-auto pb-24`
- Controls: Fixed at bottom using `position: fixed` inline styles

### Active Workout Screen
```jsx
<WorkoutSession routine={[...]} onComplete={fn} />
```

**Layout Pattern:**
- Same structure: fixed header (progress bar), scrollable content, fixed buttons
- Shows either active exercise OR rest timer
- Buttons: "Complete Set" (green) + "End Workout" (gray)
- "Complete Set" only visible when NOT resting

## Critical Technical Decisions

### 1. Fixed Positioning with Inline Styles
**Problem**: Tailwind classes like `fixed bottom-4` were not working correctly - buttons appeared in wrong positions.

**Solution**: Use inline styles for fixed positioning:
```jsx
<div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
```

**Why**: More reliable across different viewport configurations. Always use inline styles for `position: fixed` elements.

### 2. Viewport Height Management
**Implementation**:
```css
/* index.css */
html, body {
  height: 100%;
  overflow: hidden; /* Prevents page-level scrolling */
}
#root {
  height: 100%;
}
```

**Why**: Ensures only internal divs scroll, not the page itself. App behaves like a native mobile app.

### 3. Scrollable Content Padding
All scrollable sections use `pb-24` (96px) or `pb-32` (128px) bottom padding to prevent content from hiding behind fixed buttons.

## Data Structure

### Backend Models (amplify/data/resource.ts)

**CustomWorkout Model:**
```typescript
CustomWorkout: {
  userId: string (PK),
  workoutId: id (SK),
  name: string,
  author: string,
  isDefault: boolean,
  exercises: json, // JSON stringified array of exercise objects
  createdAt: string,
  updatedAt: string
}
```

**WorkoutHistory Model:**
```typescript
WorkoutHistory: {
  userId: string (PK),
  workoutDate: string (SK), // ISO date string
  workoutId: id,
  routineName: string,
  routineAuthor: string,
  status: string, // "completed" or "abandoned"
  completedExercises: integer,
  totalExercises: integer,
  durationMinutes: integer,
  exercises: json // JSON stringified array with set completion data
}
```

**Authorization:**
- Both models use owner-based authorization
- Users can only CRUD their own records
- Cognito User Pool provides authentication

### Workout Routine (workoutRoutine.json & Exercise Objects)
```json
{
  "name": "Lifetime Kettlebell",
  "author": "jon",
  "exercises": [
    {
      "order": 1,
      "exercise": "Swings",
      "setsReps": "5x15",
      "rest": 45,
      "weight": "35 lb",
      "image": "/images_exercises/kb_tracker_swing.png",
      "bellConfig": "single" // or "alternating" or "double"
    }
  ]
}
```

**Field Definitions:**
- `order`: Exercise sequence number
- `exercise`: Exercise name (string)
- `setsReps`: Format "NxM" where N=sets, M=reps (string)
- `rest`: Rest time in seconds (number)
- `weight`: Weight with unit (string)
- `image`: Path to exercise image in /public (string)
- `bellConfig`: Kettlebell configuration
  - `"single"`: One bell, no alternating
  - `"alternating"`: One bell, alternate arms
  - `"double"`: Two kettlebells

**Important:** When saving to DynamoDB, the `exercises` array is JSON.stringify'd because Amplify Gen 2 requires json fields to be strings. The workoutLibraryService automatically handles serialization/deserialization.

## Styling Guidelines

### Typography
- **Font**: Nunito (all weights 400-800 loaded)
- **App Title**: text-3xl font-bold
- **Workout Subtitle**: text-xl font-weight-200
- **Exercise Names**: text-xl font-medium

### Buttons
- **Primary Actions**: rounded-full, py-4 px-8, min-h-[52px]
- **Secondary Actions**: rounded-full, py-3 px-6, min-h-[48px]
- **Touch Targets**: Minimum 48px height for mobile accessibility
- **Colors**:
  - Start/Skip: blue-600
  - Complete Set: green-600
  - End/Cancel: gray-700

### Spacing
- **Header padding**: px-4 pt-3 pb-2
- **Bottom margin**: 16px from viewport bottom
- **Section gaps**: 16px between major sections
- **Exercise cards**: space-y-4 (16px between cards)

### Images
- **Home screen**: max-width 240px
- **Workout session**: max-w-xs (320px)
- **Format**: rounded-lg, object-cover

## Running Locally

```bash
cd kettlebell-tracker
npm install
npm run dev
# Dev server: http://localhost:5173/
```

**Local Development Authentication:**
- Auto-signs in as default user in dev mode (see `autoSignInDefaultUser` in authService.js)
- Production requires manual sign-in through Cognito Authenticator UI

## User Management

### Adding New Users (Production)

**Option 1: AWS Console (Recommended for initial users)**
```bash
# 1. Go to AWS Cognito Console
# 2. Navigate to: User Pools → kettlebell-tracker-* pool
# 3. Click "Create user"
# 4. Fill in:
#    - Email: user@example.com
#    - Send email invitation: Yes (or set temp password)
# 5. User receives email and sets password on first login
```

**Option 2: AWS CLI**
```bash
# Get your User Pool ID
AWS_PROFILE=jon aws cognito-idp list-user-pools --max-results 10 --region us-east-1

# Create a user
AWS_PROFILE=jon aws cognito-idp admin-create-user \
  --user-pool-id <USER_POOL_ID> \
  --username user@example.com \
  --user-attributes Name=email,Value=user@example.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --region us-east-1

# User must change password on first login
```

**Option 3: Self-Service Sign-Up (Future Enhancement)**
Currently the app uses Amplify Authenticator with default configuration. To enable self-service sign-up:
- Users can sign up directly through the app's login screen
- Amplify Authenticator already includes sign-up UI
- No code changes needed - it's already available in production!

**Note:** In development mode (`npm run dev`), the app auto-signs in as a default test user via `autoSignInDefaultUser()` in authService.js.

## Deployment

### Two-Part Deployment Architecture

The app has **two separate deployment processes**:
1. **Amplify Backend** (Cognito, DynamoDB, AppSync) - deployed via Amplify CLI
2. **Frontend** (React app) - deployed via CDK to S3/CloudFront

### Part 1: Amplify Backend Deployment

**Local Development (Sandbox):**
```bash
# Run local Amplify sandbox for development
npx ampx sandbox

# This creates temporary resources:
# - Cognito User Pool (dev)
# - DynamoDB tables (dev)
# - AppSync GraphQL API (dev)
# - Generates amplify_outputs.json with sandbox endpoints
```

**Testing Backend Changes Locally:**
```bash
# Test if backend can be synthesized (won't deploy, just validates)
npx ampx sandbox --once

# This will:
# - Synthesize your backend code
# - Run type checks
# - Show any errors in amplify/backend.ts or resource files
# - Exit without deploying

# Use this to validate backend changes before pushing to GitHub Actions
```

**Production Deployment:**

Backend deployment is **automated via GitHub Actions**. See `.github/AMPLIFY_DEPLOY_SETUP.md` for detailed setup instructions.

```bash
# First-time setup (creates Amplify app in AWS)
AWS_PROFILE=jon aws amplify create-app \
  --name kettlebell-tracker \
  --region us-east-1 \
  --platform WEB

# Copy the appId from output

# Add GitHub secrets (Settings → Secrets → Actions):
# - AWS_ACCESS_KEY_ID (from ~/.aws/credentials [jon] profile)
# - AWS_SECRET_ACCESS_KEY (from ~/.aws/credentials [jon] profile)
# - AMPLIFY_APP_ID (from create-app output above)

# Push workflow to trigger first deployment
git push origin main
```

**Automated Deployment:**
- Workflow: `.github/workflows/deploy-amplify-backend.yml`
- Triggers:
  - Push to main when `amplify/**` files change
  - Manual trigger from GitHub Actions UI
- Process:
  1. Runs `npx ampx pipeline-deploy --branch main --app-id $AMPLIFY_APP_ID`
  2. Creates/updates production Cognito, DynamoDB, AppSync
  3. Commits updated `amplify_outputs.json` back to repo
- GitHub Actions cost: ~3-5 min/deploy, <50 min/month = **$0** (free tier)

**Important Notes:**
- `npx ampx sandbox` is for **local dev only** - creates temporary resources
- Production deployment is **automated via GitHub Actions** (not run locally)
- After backend deploy completes, pull latest and rebuild frontend to get new config
- Amplify backend costs ~$1-2/month (Cognito free < 50k MAUs, DynamoDB ~$0.25/million ops, AppSync ~$4/million queries)

### Part 2: Frontend Deployment

```bash
# In main app repo
npm run build

# In deployment repo
cd ../workout-deployment
./deploy.sh
```

**Deploy Script Does:**
1. Clones app repo
2. Installs dependencies
3. Builds React app (includes amplify_outputs.json from repo)
4. Deploys CDK stack to AWS (using AWS_PROFILE=jon)
5. Uploads dist/ to S3
6. Invalidates CloudFront cache

**Full Production Deployment Workflow:**
```bash
# 1. Deploy Amplify backend (if backend changed)
npx ampx pipeline-deploy --branch main --app-id <your-app-id>

# 2. Rebuild frontend with production config
npm run build

# 3. Commit updated amplify_outputs.json
git add amplify_outputs.json
git commit -m "Update production Amplify config"
git push

# 4. Deploy frontend via CDK
cd ../workout-deployment
./deploy.sh
```

**DNS Configuration:**
- Domain managed on Dreamhost
- Subdomain (workout.madimadethis.com) delegated to Route53 via NS records
- SSL certificate via ACM (auto-validated via DNS)

## Current State

### Working Features ✅
- **Authentication**: Cognito User Pool with auto-sign-in in dev mode
- **Home Screen**: Scrollable exercise list with workout selector
- **Custom Workouts**: Fork/edit workouts with drag-drop reordering (@dnd-kit)
- **Workout Library**: Grid view of all workouts (default + custom)
- **Workout Session**: Active workout with set tracking
- **Rest Timer**: Circular progress animation
- **Progress Tracking**: Workout history saved to DynamoDB
- **Calendar View**: Monthly view of completed workouts
- **Cloud Sync**: All data syncs across devices via DynamoDB
- **Owner-Based Auth**: Users can only access their own data
- **Favicon**: Kettlebell logo
- Mobile-friendly touch targets
- No page-level scrolling (app-like behavior)

### Known Technical Notes
- Tailwind `fixed` positioning classes don't work reliably - always use inline styles for fixed elements
- Images are ~5-6MB each (PNGs) - could be optimized if performance becomes an issue
- Rest timer uses `setInterval` for countdown - could be upgraded to `requestAnimationFrame` for better accuracy

## Component Props Reference

### Header
```jsx
<Header
  title="string"      // Main title
  subtitle="string"   // Subtitle (workout name + author)
/>
```

### Workout
```jsx
<Workout
  exercises={array}   // Array of exercise objects
/>
```

### Controls
```jsx
<Controls
  onStartWorkout={fn} // Callback when Start Workout clicked
/>
```

### WorkoutSession
```jsx
<WorkoutSession
  routine={array}     // Array of exercise objects
  onComplete={fn}     // Callback when workout ends
/>
```

### RestTimer
```jsx
<RestTimer
  duration={number}   // Rest time in seconds
  onComplete={fn}     // Callback when timer reaches 0
  onSkip={fn}        // Callback for Skip Rest button
/>
```

## Development Context

### User Preferences
- Uses jon@madisons.com for git commits
- Deploys to AWS using `AWS_PROFILE=jon`
- Prefers component-based architecture
- Mobile-first design approach
- Minimal, functional UI (no unnecessary features)

### Design Philosophy
- App-like behavior (no page scrolling)
- Always-accessible controls (fixed buttons)
- Clean, uncluttered interface
- Large touch targets for mobile
- Soft, rounded aesthetic (rounded-full buttons)

## Future Considerations

### Potential Enhancements
- Multiple workout routines (currently hardcoded to one)
- Workout history tracking
- Custom routine builder
- Progressive overload tracking
- Sound/haptic feedback on timer completion
- PWA capabilities (offline support, install prompt)
- Image optimization (convert to WebP, reduce file sizes)

### Refactoring Opportunities
- Break WorkoutSession into smaller sub-components (ExerciseDisplay, SetCounter, etc.)
- Move workout logic to custom hooks
- Add TypeScript for better type safety
- Create shared button component
- Centralize all fixed positioning styles

## Troubleshooting

### Button Not Visible at Bottom
- Check if using Tailwind classes instead of inline styles
- Verify `html, body, #root` all have `height: 100%`
- Ensure body has `overflow: hidden`
- Check scrollable section has adequate `pb-*` padding

### Dev Server Not Hot Reloading
- Check Vite dev server is running (port 5173)
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
- Restart dev server if needed

### Deployment Issues
- Ensure AWS credentials configured for profile `jon`
- Check Route53 NS records delegated in Dreamhost
- CloudFront propagation can take 5-15 minutes
- First deploy takes 20-30 minutes (CloudFront distribution creation)

## Git Workflow

All commits use format:
```
Short description of changes

- Bullet point details
- More details

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Committer identity:
- Email: jon@madisons.com
- Name: Jon Madison

---

**Last Updated**: 2026-01-10
**Project Status**: Active Development
**Claude Session**: Initial build and deployment complete
