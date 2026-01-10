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
- **Deployment**: AWS CDK (separate repo)

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

### Workout Routine (workoutRoutine.json)
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

## Deployment

### Build & Deploy
```bash
# In main app repo
npm run build

# In deployment repo
cd ../workout-deployment
./deploy.sh
```

**Deploy Script Does:**
1. Clones app repo
2. Builds React app
3. Deploys CDK stack to AWS (using AWS_PROFILE=jon)
4. Uploads dist/ to S3
5. Invalidates CloudFront cache

**DNS Configuration:**
- Domain managed on Dreamhost
- Subdomain (workout.madimadethis.com) delegated to Route53 via NS records
- SSL certificate via ACM (auto-validated via DNS)

## Current State

### Working Features ✅
- Home screen with scrollable exercise list
- Fixed bottom "Start Workout" button (always visible)
- Active workout session with set tracking
- Rest timer with circular progress animation
- Fixed workout buttons (Complete Set + End Workout)
- Progress bar showing workout completion
- Exercise list showing completed/current/upcoming
- Nunito font loaded and applied
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
