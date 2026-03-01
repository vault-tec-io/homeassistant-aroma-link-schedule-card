# Aroma-Link Schedule Card

A custom Lovelace card for managing Aroma-Link diffuser schedules with a collapsible visual editor.

## Features

- ✨ **Collapsible Design** - 5 schedule blocks start collapsed for space efficiency
- 🔍 **Auto Device Detection** - No manual device ID lookup required
- ⏰ **Time Pickers** - Easy start/end time selection
- ⚙️ **Duration Controls** - Adjust work and pause durations
- 📅 **Day Selector** - Visual checkboxes for each day of the week
- 🎚️ **Enable/Disable Toggle** - Quick on/off for each block
- 🔄 **Live Updates** - Shows current configuration
- 💾 **One-Click Save** - Saves directly to your device

## Requirements

This card requires the [Aroma-Link Diffuser integration](https://github.com/vault-tec-io/homeassistant-aroma-link) to be installed and configured.

## Quick Start

After installation, add the card to your dashboard:

```yaml
type: custom:aroma-link-schedule-card
entity: switch.smart  # Your device entity
```

The card automatically detects your device and displays all 5 schedule blocks in a collapsed state. Click any block to expand and edit it.
