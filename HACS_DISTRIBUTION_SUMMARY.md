# HACS Distribution Setup - Summary

I've prepared everything needed to distribute the Aroma-Link Schedule Card through HACS.

## What Was Created

All files for a separate HACS plugin repository are in `/tmp/aroma-link-schedule-card/`:

1. **aroma-link-schedule-card.js** - The v2.0 card (collapsible design, auto-detection)
2. **hacs.json** - HACS configuration declaring this as a "plugin" type
3. **info.md** - HACS store listing description
4. **README.md** - Full documentation with installation and usage
5. **LICENSE** - MIT License
6. **SETUP_GUIDE.md** - Detailed instructions for setting up the repository
7. **.gitignore** - Git ignore file

## Quick Setup (3 Steps)

### Step 1: Create GitHub Repository

```bash
# Create a new public repository on GitHub named:
# aroma-link-schedule-card
```

### Step 2: Push Files

```bash
# Copy files and initialize
cd /tmp/aroma-link-schedule-card
git init
git add .
git commit -m "Initial commit: Aroma-Link Schedule Card v2.0"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/aroma-link-schedule-card.git
git branch -M main
git push -u origin main

# Create release tag
git tag v2.0.0
git push origin v2.0.0
```

### Step 3: Configure GitHub Repository

1. **Add Topics** (for discoverability):
   - `home-assistant`
   - `lovelace-custom-card`
   - `hacs`
   - `diffuser`

2. **Create Release on GitHub**:
   - Go to Releases → Draft a new release
   - Tag: `v2.0.0`
   - Title: "v2.0.0 - Initial Release"
   - Publish

## Two Distribution Options

### Option A: Custom Repository (Immediate Use)

Users add manually in HACS:
1. HACS → Frontend → ⋮ Menu
2. Custom repositories
3. URL: `https://github.com/YOUR-USERNAME/aroma-link-schedule-card`
4. Category: Lovelace
5. Add → Install

### Option B: Default HACS Repository (Recommended)

Submit to official HACS:
1. Ensure all requirements met (see SETUP_GUIDE.md)
2. Submit PR to: https://github.com/hacs/default
3. Add to `data/lovelace.json`
4. After approval, users can search in HACS directly

## Benefits of Separate Repository

✅ HACS automatically registers the frontend resource
✅ Independent versioning from the integration
✅ Easier for users to find in HACS Frontend section
✅ Automatic updates through HACS
✅ No manual resource configuration needed

## Alternative: Bundle with Integration

If you prefer to keep the card in the main repo:
- Card stays in `www/aroma-link-schedule-card.js`
- Users manually add resource in Lovelace
- Simpler maintenance but less HACS integration

## Next Steps

1. Decide: Separate repo or bundled?
2. If separate: Follow SETUP_GUIDE.md
3. Update main integration README to reference card
4. Test installation via HACS custom repository
5. Optionally submit to HACS default

## Support

The SETUP_GUIDE.md file contains detailed instructions for each step, including:
- Repository structure requirements
- HACS submission process
- Testing procedures
- Version update workflow
