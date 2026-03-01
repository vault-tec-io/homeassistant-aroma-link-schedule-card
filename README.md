# Aroma-Link Schedule Card

A custom Lovelace card for managing Aroma-Link diffuser schedules with a collapsible visual editor.

## Features

- **Collapsible Design**: 5 schedule blocks start collapsed, click to expand
- **Auto Device Detection**: Automatically finds your device ID
- **Visual Editor**: Intuitive UI for all 5 schedule blocks
- **Time Pickers**: Easy start/end time selection
- **Duration Controls**: Adjust work and pause durations
- **Day Selector**: Visual checkboxes for each day of the week
- **Enable/Disable Toggle**: Quick on/off for each block
- **Live Updates**: Shows current configuration
- **One-Click Save**: Saves directly to your device

## Installation

### Option 1: Manual Installation

1. Copy `aroma-link-schedule-card.js` to your `www` folder:
   ```
   /config/www/aroma-link-schedule-card.js
   ```

2. Add the resource to your Lovelace configuration:

   **Via UI:**
   - Settings → Dashboards → Three dots menu → Resources
   - Click "+ Add Resource"
   - URL: `/local/aroma-link-schedule-card.js`
   - Resource type: JavaScript Module

   **Via YAML:**
   ```yaml
   resources:
     - url: /local/aroma-link-schedule-card.js
       type: module
   ```

3. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)

### Option 2: HACS Installation (Future)

This card will be available through HACS in the future.

## Usage

Add the card to your dashboard:

```yaml
type: custom:aroma-link-schedule-card
entity: switch.smart  # Your device entity (used to auto-detect device and find schedule blocks)
```

## Card Configuration

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | string | Yes | - | Any entity from your device (e.g., `switch.smart`) - used to auto-detect device |

## How It Works

The card:
1. Auto-detects device ID from schedule block entity unique_id
2. Automatically finds your 5 schedule block entities
3. Displays blocks in collapsed state showing current status
4. Click any block to expand and edit times, durations, and days
5. Saves changes by calling `aroma_link.set_schedule_block` service
6. Updates display when entity states change

## Example Configurations

### Basic Setup
```yaml
type: custom:aroma-link-schedule-card
entity: switch.smart
```

### In a Vertical Stack
```yaml
type: vertical-stack
cards:
  - type: markdown
    content: |
      ## 🌿 Diffuser Control
  - type: entities
    entities:
      - entity: switch.smart
        name: Power
      - entity: switch.smart_fan
        name: Fan
  - type: custom:aroma-link-schedule-card
    entity: switch.smart
```

## Troubleshooting

**Card not showing:**
- Make sure the resource is added correctly
- Clear browser cache (Ctrl+F5)
- Check browser console for errors

**Entities not found:**
- Verify your `entity` configuration
- Check that schedule block entities exist (binary_sensor.{device}_schedule_block_1-5)
- Restart Home Assistant if entities were just added

**Save not working:**
- Check Home Assistant logs for service call errors
- Verify schedule block entities exist for your device
- Ensure WebSocket connection is active

## Screenshots

The card displays:
- **Header**: Schedule Manager title with auto-detected device ID
- **5 Collapsible Blocks**: Each starts collapsed showing:
  - Status indicator (✓ enabled / ○ disabled)
  - Current time range and active days
  - Click to expand for full editor
- **Expanded Block Editor**:
  - Enable/disable toggle
  - Start and end time pickers
  - Work and pause duration inputs
  - Day selector (Sun-Sat)
  - Save and Close buttons

## Development

To modify the card:
1. Edit `aroma-link-schedule-card.js`
2. Save changes
3. Refresh browser to see updates
4. No Home Assistant restart needed for UI changes

## Support

For issues or feature requests, visit:
https://github.com/vault-tec-io/homeassistant-aroma-link/issues
