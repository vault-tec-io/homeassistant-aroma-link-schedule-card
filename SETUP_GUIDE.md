# HACS Setup Guide for Aroma-Link Schedule Card

This guide explains how to set up a separate GitHub repository for the Lovelace card to be distributed through HACS.

## Repository Structure

Your new repository should have this structure:

```
aroma-link-schedule-card/
├── aroma-link-schedule-card.js  # The card JavaScript file
├── hacs.json                    # HACS configuration
├── info.md                      # HACS store description
├── README.md                    # Full documentation
└── LICENSE                      # License file (MIT recommended)
```

## Setup Steps

### 1. Create New GitHub Repository

1. Go to GitHub and create a new repository:
   - Name: `aroma-link-schedule-card`
   - Description: "Custom Lovelace card for managing Aroma-Link diffuser schedules"
   - Public repository
   - Add MIT License

### 2. Initialize Repository

```bash
# Create local repository
mkdir aroma-link-schedule-card
cd aroma-link-schedule-card

# Copy files from /tmp/aroma-link-schedule-card/
cp /tmp/aroma-link-schedule-card/* .

# Initialize git
git init
git add .
git commit -m "Initial commit: Aroma-Link Schedule Card v2.0"

# Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/aroma-link-schedule-card.git
git branch -M main
git push -u origin main
```

### 3. Create Initial Release

HACS requires at least one release tag:

```bash
# Create and push v2.0.0 tag
git tag v2.0.0
git push origin v2.0.0
```

Then on GitHub:
1. Go to "Releases"
2. Click "Draft a new release"
3. Select tag `v2.0.0`
4. Title: "v2.0.0 - Initial Release"
5. Description: Brief overview of features
6. Publish release

### 4. Register with HACS

**Option A: Add as Custom Repository (Immediate)**
Users can add it manually:
1. HACS → Frontend
2. Three dots menu → Custom repositories
3. Repository: `https://github.com/YOUR-USERNAME/aroma-link-schedule-card`
4. Category: Lovelace
5. Click Add

**Option B: Submit to HACS Default Repository (Recommended)**
For official HACS distribution:
1. Ensure repository meets [HACS requirements](https://hacs.xyz/docs/publish/start)
2. Submit PR to [HACS default repository](https://github.com/hacs/default)
3. Wait for review and approval

## HACS Requirements Checklist

- ✅ Public GitHub repository
- ✅ `hacs.json` file with proper configuration
- ✅ At least one release tag
- ✅ Repository description set
- ✅ Topics include `home-assistant` and `lovelace-custom-card`
- ✅ README with installation and usage instructions
- ✅ License file (MIT recommended)

## Repository Settings

On GitHub, configure these settings:

1. **Repository Topics** (helps discoverability):
   - `home-assistant`
   - `lovelace-custom-card`
   - `hacs`
   - `diffuser`
   - `aroma-link`

2. **About Section**:
   - Description: "Custom Lovelace card for managing Aroma-Link diffuser schedules"
   - Website: Link to your main integration repo
   - Topics: As above

## Testing Installation

After setup, test the HACS installation:

1. Add as custom repository (Option A above)
2. Install the card through HACS
3. Verify it appears in `/config/www/community/aroma-link-schedule-card/`
4. Verify HACS automatically added the resource
5. Add card to a dashboard and test functionality

## Maintenance

When updating the card:

1. Make changes to `aroma-link-schedule-card.js`
2. Update version in file header comment
3. Commit changes
4. Create new git tag: `git tag v2.1.0`
5. Push tag: `git push origin v2.1.0`
6. Create GitHub release for the new tag
7. HACS will detect the new version automatically

## Linking to Main Integration

Update the main integration README to mention the card:

```markdown
### Custom Lovelace Card

A companion Lovelace card is available for managing schedules:
[Aroma-Link Schedule Card](https://github.com/YOUR-USERNAME/aroma-link-schedule-card)

Install via HACS:
1. HACS → Frontend
2. Search for "Aroma-Link Schedule Card"
3. Install
```
