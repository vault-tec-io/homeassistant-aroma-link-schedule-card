/**
 * Aroma-Link Schedule Card v3.0
 * Passes entity_id to service — integration resolves device_id server-side
 */

class AromaLinkScheduleCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    this._config = config;
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    // Only reload and re-render when a relevant schedule entity changes.
    // This prevents destroying in-progress user edits on unrelated state updates.
    const baseName = this._config.entity.split('.')[1];
    const watchedIds = Array.from({ length: 5 }, (_, i) =>
      `binary_sensor.${baseName}_schedule_block_${i + 1}`
    );
    const hasChange = !oldHass || watchedIds.some(id => hass.states[id] !== oldHass.states[id]);

    if (hasChange) {
      this._loadScheduleData();
      this._render();
    }
  }

  _loadScheduleData() {
    const baseName = this._config.entity.split('.')[1];
    const prevBlocks = this._blocks || [];
    this._blocks = [];

    for (let i = 1; i <= 5; i++) {
      const entityId = `binary_sensor.${baseName}_schedule_block_${i}`;
      const entity = this._hass?.states[entityId];
      const prev = prevBlocks[i - 1];

      this._blocks.push({
        number: i,
        entityId: entityId,
        enabled: entity?.state === 'on',
        startTime: entity?.attributes?.start_time || '00:00',
        endTime: entity?.attributes?.end_time || '00:00',
        workDuration: entity?.attributes?.work_duration || 10,
        pauseDuration: entity?.attributes?.pause_duration || 120,
        days: entity?.attributes?.days || [],
        daysDisplay: entity?.attributes?.days_display || 'None',
        expanded: prev?.expanded || false
      });
    }
  }

  _render() {
    if (!this._hass || !this._blocks) return;

    const styles = `
      <style>
        :host {
          display: block;
        }
        .card {
          padding: 16px;
          background: var(--card-background-color);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--primary-color);
        }
        .title {
          font-size: 24px;
          font-weight: 500;
        }
        .block {
          margin-bottom: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .block.enabled {
          border-color: var(--primary-color);
        }
        .block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          background: var(--card-background-color);
          user-select: none;
        }
        .block-header:hover {
          background: var(--secondary-background-color);
        }
        .block.enabled .block-header {
          background: rgba(var(--rgb-primary-color), 0.1);
        }
        .block-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        }
        .block-info {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
        .expand-icon {
          transition: transform 0.2s;
          color: var(--secondary-text-color);
        }
        .block.expanded .expand-icon {
          transform: rotate(180deg);
        }
        .block-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        .block.expanded .block-content {
          max-height: 1000px;
          transition: max-height 0.3s ease-in;
        }
        .block-body {
          padding: 16px;
          background: var(--secondary-background-color);
          border-top: 1px solid var(--divider-color);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--secondary-text-color);
        }
        .form-input {
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }
        .days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 12px;
        }
        .day {
          padding: 8px 4px;
          text-align: center;
          font-size: 11px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
        }
        .day.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        .btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        .btn-primary:hover {
          opacity: 0.9;
        }
        .btn-secondary {
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color);
        }
        .toggle {
          position: relative;
          width: 44px;
          height: 24px;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          inset: 0;
          background: var(--disabled-color);
          border-radius: 24px;
          transition: 0.3s;
          cursor: pointer;
        }
        .toggle-slider:before {
          content: "";
          position: absolute;
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }
        .toggle input:checked + .toggle-slider {
          background: var(--primary-color);
        }
        .toggle input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        .error {
          padding: 16px;
          background: var(--error-color);
          color: white;
          border-radius: 8px;
          margin: 16px;
        }
      </style>
    `;

    const baseName = this._config.entity.split('.')[1];
    const firstBlockId = `binary_sensor.${baseName}_schedule_block_1`;
    if (!this._hass?.states?.[firstBlockId]) {
      this.shadowRoot.innerHTML = styles + `
        <div class="card">
          <div class="header"><div class="title">Schedule Manager</div></div>
          <div style="padding:16px;color:var(--secondary-text-color);text-align:center;">
            Waiting for schedule entities&hellip;<br>
            <small>Expected: <code>${firstBlockId}</code></small>
          </div>
        </div>
      `;
      return;
    }

    const content = `
      <div class="card">
        <div class="header">
          <div class="title">Schedule Manager</div>
        </div>
        ${this._blocks.map(block => this._renderBlock(block)).join('')}
      </div>
    `;

    this.shadowRoot.innerHTML = styles + content;
    this._attachListeners();
  }

  _renderBlock(block) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const statusIcon = block.enabled ? '✓' : '○';
    const statusText = block.enabled
      ? `${block.startTime}-${block.endTime} · ${block.daysDisplay}`
      : 'Disabled';

    return `
      <div class="block ${block.enabled ? 'enabled' : ''} ${block.expanded ? 'expanded' : ''}" data-block="${block.number}">
        <div class="block-header" onclick="this.getRootNode().host._toggleBlock(${block.number})">
          <div class="block-title">
            <span>${statusIcon}</span>
            <span>Block ${block.number}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="block-info">${statusText}</div>
            <div class="expand-icon">▼</div>
          </div>
        </div>
        <div class="block-content">
          <div class="block-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 500;">Enable Block ${block.number}</span>
              <label class="toggle">
                <input type="checkbox" data-block="${block.number}" data-field="enabled"
                  ${block.enabled ? 'checked' : ''}
                  onchange="this.getRootNode().host._updateField(${block.number}, 'enabled', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label class="form-label">Start Time</label>
                <input type="time" class="form-input" value="${block.startTime}"
                  onchange="this.getRootNode().host._updateField(${block.number}, 'startTime', this.value)">
              </div>
              <div class="form-field">
                <label class="form-label">End Time</label>
                <input type="time" class="form-input" value="${block.endTime}"
                  onchange="this.getRootNode().host._updateField(${block.number}, 'endTime', this.value)">
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label class="form-label">Work (seconds)</label>
                <input type="number" class="form-input" min="5" max="900" value="${block.workDuration}"
                  onchange="this.getRootNode().host._updateField(${block.number}, 'workDuration', parseInt(this.value))">
              </div>
              <div class="form-field">
                <label class="form-label">Pause (seconds)</label>
                <input type="number" class="form-input" min="60" max="900" value="${block.pauseDuration}"
                  onchange="this.getRootNode().host._updateField(${block.number}, 'pauseDuration', parseInt(this.value))">
              </div>
            </div>

            <div class="form-label">Active Days</div>
            <div class="days">
              ${dayNames.map((day, idx) => `
                <div class="day ${block.days.includes(idx) ? 'active' : ''}"
                  onclick="this.getRootNode().host._toggleDay(${block.number}, ${idx})">
                  ${day}
                </div>
              `).join('')}
            </div>

            <div class="actions">
              <button class="btn btn-primary" onclick="this.getRootNode().host._saveBlock(${block.number})">
                💾 Save
              </button>
              <button class="btn btn-secondary" onclick="this.getRootNode().host._toggleBlock(${block.number})">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _toggleBlock(blockNum) {
    this._blocks[blockNum - 1].expanded = !this._blocks[blockNum - 1].expanded;
    this._render();
  }

  _updateField(blockNum, field, value) {
    this._blocks[blockNum - 1][field] = value;
  }

  _toggleDay(blockNum, dayIdx) {
    const block = this._blocks[blockNum - 1];
    const idx = block.days.indexOf(dayIdx);
    if (idx > -1) {
      block.days.splice(idx, 1);
    } else {
      block.days.push(dayIdx);
    }
    this._render();
  }

  _saveBlock(blockNum) {
    const block = this._blocks[blockNum - 1];

    this._hass.callService('aroma_link', 'set_schedule_block', {
      entity_id: this._config.entity,
      block_number: blockNum,
      start_time: block.startTime,
      end_time: block.endTime,
      work_duration: block.workDuration,
      pause_duration: block.pauseDuration,
      days: block.days.map(d => String(d)),
      enabled: block.enabled
    }).then(() => {
      // Show success feedback
      const btn = this.shadowRoot.querySelector(`[onclick*="_saveBlock(${blockNum})"]`);
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Saved!';
        btn.style.background = '#4caf50';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
        }, 2000);
      }
    });
  }

  _attachListeners() {
    // Events are handled via onclick in HTML for simplicity
  }

  getCardSize() {
    return 3;
  }

  static getStubConfig() {
    return { entity: '' };
  }
}

customElements.define('aroma-link-schedule-card', AromaLinkScheduleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'aroma-link-schedule-card',
  name: 'Aroma-Link Schedule Card',
  description: 'Manage diffuser schedules with collapsible blocks'
});

console.info('%c AROMA-LINK-SCHEDULE-CARD %c v3.0 ', 'color: white; background: #039be5; font-weight: 700;', 'color: #039be5; background: white; font-weight: 700;');
