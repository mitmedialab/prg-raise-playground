/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { ScreenReader } from './screen_reader';

/**
 * Speech settings interface
 */
export interface SpeechSettings {
  enabled: boolean;    //Enable/disable screen reader
  rate: number;        // 0.5 - 3.0
  pitch: number;       // 0.5 - 2.0
  volume: number;      // 0.1 - 1.0
  voiceIndex: number;  // Index in available voices array
}

/**
 * Class for handling the settings dialog.
 */
export class SettingsDialog {
  outputDiv: HTMLElement | null;
  modalContainer: HTMLElement | null;
  settingsDialog: HTMLDialogElement | null;
  open: boolean;
  closeButton: HTMLElement | null;
  private screenReader: ScreenReader;
  private currentSettings: SpeechSettings;
  private originalSettings: SpeechSettings;

  private announcedControls: Set<string> = new Set();

  /**
   * Constructor for settings dialog.
   */
  constructor(screenReader: ScreenReader) {
    this.screenReader = screenReader;

    // For settings, we'll use a div named 'settings'
    this.outputDiv = document.getElementById('settings');

    this.open = false;
    this.modalContainer = null;
    this.settingsDialog = null;
    this.closeButton = null;

    // Load current settings
    this.currentSettings = this.loadSettings();
    this.currentSettings.enabled = this.screenReader.isScreenReaderEnabled();
    this.originalSettings = { ...this.currentSettings };
  }

  /**
   * Load settings from localStorage with defaults
   */
  private loadSettings(): SpeechSettings {
    const saved = localStorage.getItem('blockly-screenreader-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved settings, using defaults');
      }
    }

    return this.getDefaultSettings();
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): SpeechSettings {
    return {
      enabled: true,
      rate: 1.7,
      pitch: 1.0,
      volume: 1.0,
      voiceIndex: 0
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('blockly-screenreader-settings', JSON.stringify(this.currentSettings));
    this.screenReader.updateSettings(this.currentSettings);
  }

  /**
   * Get available voices
   */
  private getAvailableVoices(): SpeechSynthesisVoice[] {
    return window.speechSynthesis.getVoices();
  }

  /**
 * Toggle settings dialog open/closed
 */
  toggle() {
    if (this.modalContainer && this.settingsDialog) {
      if (this.settingsDialog.hasAttribute('open')) {
        this.settingsDialog.close();
      } else {
        this.originalSettings = { ...this.currentSettings };
        this.settingsDialog.showModal();

        // ADD DEBUG CHECK
        this.debugVoiceLoading();

        setTimeout(() => {
          this.screenReader.forceSpeek(
            'Settings window opened. Use Tab to navigate through settings controls. Press Escape or select Cancel to close without saving.'
          );
        }, 100);
      }
    }
  }


  /**
   * Apply settings immediately for live preview
   */
  private applySettingsPreview(): void {
    this.screenReader.updateSettings(this.currentSettings);
  }

  /**
   * Test current speech settings
   */
  private testCurrentSettings(): void {
    this.screenReader.testSpeechSettings('This is how your speech will sound with the current settings.');
  }

  /**
   * Reset to default settings
   */
  private resetToDefaults(): void {
    this.currentSettings = this.getDefaultSettings();
    this.updateControlValues();
    this.applySettingsPreview();
    this.screenReader.testSpeechSettings('Settings reset to defaults.');
  }

  /**
   * Save changes and close
   */
  private saveAndClose(): void {
    this.saveSettings();
    this.settingsDialog?.close();
    this.screenReader.testSpeechSettings('Settings saved successfully.');
  }

  /**
   * Cancel changes and close
   */
  private cancelAndClose(): void {
    this.currentSettings = { ...this.originalSettings };
    this.applySettingsPreview();
    this.settingsDialog?.close();
    this.screenReader.testSpeechSettings('Settings cancelled. Original settings restored.');
  }

  /**
   * Update control values in the UI
   */
  private updateControlValues(): void {
    const rateSlider = document.getElementById('speech-rate') as HTMLInputElement;
    const pitchSlider = document.getElementById('speech-pitch') as HTMLInputElement;
    const volumeSlider = document.getElementById('speech-volume') as HTMLInputElement;
    const voiceSelect = document.getElementById('speech-voice') as HTMLSelectElement;
    const enabledCheckbox = document.getElementById('screen-reader-enabled') as HTMLInputElement; // NEW

    if (rateSlider) rateSlider.value = this.currentSettings.rate.toString();
    if (pitchSlider) pitchSlider.value = this.currentSettings.pitch.toString();
    if (volumeSlider) volumeSlider.value = this.currentSettings.volume.toString();
    if (voiceSelect) voiceSelect.selectedIndex = this.currentSettings.voiceIndex;
    if (enabledCheckbox) enabledCheckbox.checked = this.currentSettings.enabled; // NEW
  }

  /**
 * Ensure voices are loaded before creating the dialog
 */
  private ensureVoicesLoaded(): void {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      // Voices not loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded, updating dropdown...');
        this.updateVoiceDropdown(); // UPDATE just the dropdown
      };

      // Also try to trigger voice loading
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Update just the voice dropdown with loaded voices
   */
  private updateVoiceDropdown(): void {
    const voiceSelect = document.getElementById('speech-voice') as HTMLSelectElement;
    if (!voiceSelect) {
      console.log('Voice dropdown not found, will update when dialog opens');
      return;
    }

    const voices = this.getAvailableVoices();
    console.log('Updating voice dropdown with', voices.length, 'voices');

    // Clear existing options
    voiceSelect.innerHTML = '';

    if (voices.length === 0) {
      voiceSelect.innerHTML = '<option value="0">Default Voice (Loading...)</option>';
    } else {
      // Add all available voices
      voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = `${voice.name} (${voice.lang})`;

        // Select current voice
        if (index === this.currentSettings.voiceIndex) {
          option.selected = true;
        }

        voiceSelect.appendChild(option);
      });
    }

    console.log('Voice dropdown updated with', voiceSelect.options.length, 'options');
  }

  /**
   * Create the settings modal content
   */
  createModalContent() {

    let voiceOptions = '';
    const voices = this.getAvailableVoices();
    console.log('Creating modal with', voices.length, 'voices'); // Debug

    if (voices.length === 0) {
      voiceOptions = '<option value="0">Default Voice (Loading...)</option>';
    } else {
      voices.forEach((voice, index) => {
        const selected = index === this.currentSettings.voiceIndex ? 'selected' : '';
        voiceOptions += `<option value="${index}" ${selected}>${voice.name} (${voice.lang})</option>`;
      });
    }

    console.log('Generated voice options:', voiceOptions.substring(0, 200) + '...'); // Debug

    const modalContents = `
    <div class="modal-container">
      <dialog class="settings-modal">
        <div class="settings-container" tabindex="0">
          <div class="header">
            <button class="close-modal" aria-label="Close settings">
              <span class="material-symbols-outlined">close</span>
            </button>
            <h1>Screen Reader Settings</h1>
          </div>

          <div class="setting-group">
              <label class="checkbox-label">
                <input type="checkbox" id="screen-reader-enabled" ${this.currentSettings.enabled ? 'checked' : ''}>
                <span class="checkbox-text">Enable Screen Reader</span>
              </label>
              <div class="setting-description">Turn screen reader announcements on or off</div>
            </div>
          
          <div class="settings-content">
            <div class="setting-group">
              <label for="speech-rate">Speech Rate: <span id="rate-value">${this.currentSettings.rate}</span></label>
              <input type="range" id="speech-rate" min="0.5" max="3.0" step="0.1" value="${this.currentSettings.rate}" 
                     aria-describedby="rate-description">
              <div id="rate-description" class="setting-description">Controls how fast speech is spoken</div>
            </div>

            <div class="setting-group">
              <label for="speech-pitch">Speech Pitch: <span id="pitch-value">${this.currentSettings.pitch}</span></label>
              <input type="range" id="speech-pitch" min="0.5" max="2.0" step="0.1" value="${this.currentSettings.pitch}"
                     aria-describedby="pitch-description">
              <div id="pitch-description" class="setting-description">Controls the pitch/tone of speech</div>
            </div>

            <div class="setting-group">
              <label for="speech-volume">Speech Volume: <span id="volume-value">${this.currentSettings.volume}</span></label>
              <input type="range" id="speech-volume" min="0.1" max="1.0" step="0.1" value="${this.currentSettings.volume}"
                       aria-describedby="volume-description">
              <div id="volume-description" class="setting-description">Controls how loud speech is</div>
            </div>

            <div class="setting-group">
              <label for="speech-voice">Voice Selection:</label>
              <select id="speech-voice" aria-describedby="voice-description">
                ${voiceOptions}
              </select>
              <div id="voice-description" class="setting-description">Choose which voice to use for speech</div>
            </div>

            <div class="action-buttons">
              <button id="test-settings" class="test-button">Test Current Settings</button>
              <button id="reset-defaults" class="reset-button">Reset to Defaults</button>
              <button id="save-settings" class="save-button">Save Changes</button>
              <button id="cancel-settings" class="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      </dialog>
    </div>`;

    if (this.outputDiv) {
      this.outputDiv.innerHTML = modalContents;
      this.modalContainer = this.outputDiv.querySelector('.modal-container');
      this.settingsDialog = this.outputDiv.querySelector('.settings-modal');
      this.closeButton = this.outputDiv.querySelector('.close-modal');

      this.setupEventListeners();

      // Update voice dropdown after dialog is created
      setTimeout(() => {
        this.updateVoiceDropdown();
      }, 100);
    }
  }

  /**
   * Set up event listeners for all controls
   */
  private setupEventListeners(): void {
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.cancelAndClose();
      });
    }

    // Escape key to close
    this.settingsDialog?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.cancelAndClose();
      }
    });

    // Speech rate slider
    const rateSlider = document.getElementById('speech-rate') as HTMLInputElement;
    const rateValue = document.getElementById('rate-value') as HTMLElement;
    if (rateSlider && rateValue) {
      // ADD focus listener for first-time instructions
      rateSlider.addEventListener('focus', () => {
        if (!this.announcedControls.has('rate')) {
          this.announcedControls.add('rate');
          setTimeout(() => {
            this.screenReader.forceSpeek(
              `Speech rate: ${rateSlider.value}. Use left and right arrow keys to adjust between 0.5 and 3.0.`
            );
          }, 100);
        }
      });

      rateSlider.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        this.currentSettings.rate = value;
        rateValue.textContent = value.toString();
        this.applySettingsPreview();
        // Only announce the value, not the instructions
        this.screenReader.testSpeechSettings(value.toString());
      });
    }

    // Speech pitch slider
    const pitchSlider = document.getElementById('speech-pitch') as HTMLInputElement;
    const pitchValue = document.getElementById('pitch-value') as HTMLElement;
    if (pitchSlider && pitchValue) {
      // ADD focus listener for first-time instructions
      pitchSlider.addEventListener('focus', () => {
        if (!this.announcedControls.has('pitch')) {
          this.announcedControls.add('pitch');
          setTimeout(() => {
            this.screenReader.forceSpeek(
              `Speech pitch: ${pitchSlider.value}. Use left and right arrow keys to adjust between 0.5 and 2.0.`
            );
          }, 100);
        }
      });

      pitchSlider.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        this.currentSettings.pitch = value;
        pitchValue.textContent = value.toString();
        this.applySettingsPreview();
        this.screenReader.testSpeechSettings(value.toString());
      });
    }

    // Speech volume slider
    const volumeSlider = document.getElementById('speech-volume') as HTMLInputElement;
    const volumeValue = document.getElementById('volume-value') as HTMLElement;
    if (volumeSlider && volumeValue) {
      // ADD focus listener for first-time instructions
      volumeSlider.addEventListener('focus', () => {
        if (!this.announcedControls.has('volume')) {
          this.announcedControls.add('volume');
          setTimeout(() => {
            this.screenReader.forceSpeek(
              `Speech volume: ${volumeSlider.value}. Use left and right arrow keys to adjust between 0.1 and 1.0.`
            );
          }, 100);
        }
      });

      volumeSlider.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        this.currentSettings.volume = value;
        volumeValue.textContent = value.toString();
        this.applySettingsPreview();
        this.screenReader.testSpeechSettings(value.toString());
      });
    }

    // Screen reader enable/disable checkbox
    const enabledCheckbox = document.getElementById('screen-reader-enabled') as HTMLInputElement;
    if (enabledCheckbox) {
      enabledCheckbox.addEventListener('focus', () => {
        if (!this.announcedControls.has('enabled')) {
          this.announcedControls.add('enabled');
          setTimeout(() => {
            const status = enabledCheckbox.checked ? 'enabled' : 'disabled';
            this.screenReader.forceSpeek(
              `Screen reader checkbox. Currently ${status}. Press space to toggle.`
            );
          }, 100);
        }
      });

      enabledCheckbox.addEventListener('change', (e) => {
        const isEnabled = (e.target as HTMLInputElement).checked;
        this.currentSettings.enabled = isEnabled;
        this.applySettingsPreview();

        if (isEnabled) {
          this.screenReader.testSpeechSettings('Screen reader enabled');
        } else {
          this.screenReader.testSpeechSettings('Screen reader disabled');
        }
      });
    } else {
      console.error('Screen reader enabled checkbox NOT found!');
    }


    // Voice selection - FINAL WORKING VERSION
    const voiceSelect = document.getElementById('speech-voice') as HTMLSelectElement;
    if (voiceSelect) {
      console.log('Voice select element found, setting up listeners');

      voiceSelect.addEventListener('focus', () => {
        console.log('Voice dropdown focused');
        if (!this.announcedControls.has('voice')) {
          this.announcedControls.add('voice');
          setTimeout(() => {
            const voices = this.getAvailableVoices();
            const currentVoice = voices[voiceSelect.selectedIndex]?.name || 'No voice selected';
            console.log('Announcing voice instructions:', currentVoice);
            this.screenReader.forceSpeek(
              `Voice selection dropdown. Currently selected: ${currentVoice}. Use up and down arrow keys to browse voices, Enter to select.`
            );
          }, 100);
        }
      });

      // CATCH ARROW KEYS BEFORE BROWSER HANDLES THEM
      voiceSelect.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          console.log('🔴 Arrow key intercepted:', e.key);

          // Calculate what the new index will be
          let newIndex = voiceSelect.selectedIndex;
          const voices = this.getAvailableVoices();

          if (e.key === 'ArrowDown' && newIndex < voices.length - 1) {
            newIndex++;
          } else if (e.key === 'ArrowUp' && newIndex > 0) {
            newIndex--;
          }

          // Update the select manually
          voiceSelect.selectedIndex = newIndex;

          // Announce the new voice immediately
          const selectedVoice = voices[newIndex];
          if (selectedVoice) {
            const voiceName = selectedVoice.name;
            console.log('🔴 Announcing immediately:', voiceName);
            this.screenReader.speakHighPriority(voiceName);

            // Update settings immediately too
            this.currentSettings.voiceIndex = newIndex;
            this.applySettingsPreview();
          }

          // Prevent the browser's default arrow key behavior
          e.preventDefault();
        }
      });

      // Keep INPUT event as backup (for mouse clicks, etc.)
      voiceSelect.addEventListener('input', (e) => {
        console.log('🟢 INPUT event fired (backup)');
        const voices = this.getAvailableVoices();
        const selectedVoice = voices[voiceSelect.selectedIndex];

        if (selectedVoice) {
          const voiceName = selectedVoice.name;
          console.log('🟢 Backup announcement:', voiceName);
          this.screenReader.speakHighPriority(voiceName);
        }
      });

      // Keep CHANGE event for final confirmation
      voiceSelect.addEventListener('change', (e) => {
        console.log('🔵 CHANGE event fired');
        const value = parseInt((e.target as HTMLSelectElement).value);
        this.currentSettings.voiceIndex = value;
        this.applySettingsPreview();
        console.log('🔵 Settings confirmed for voice index:', value);
      });

    } else {
      console.error('Voice select element NOT found!');
    }

    // Action buttons
    const testButton = document.getElementById('test-settings');
    const resetButton = document.getElementById('reset-defaults');
    const saveButton = document.getElementById('save-settings');
    const cancelButton = document.getElementById('cancel-settings');

    testButton?.addEventListener('click', () => this.testCurrentSettings());
    resetButton?.addEventListener('click', () => this.resetToDefaults());
    saveButton?.addEventListener('click', () => this.saveAndClose());
    cancelButton?.addEventListener('click', () => this.cancelAndClose());
  }

  /**
 * Debug voice loading issues
 */
  private debugVoiceLoading(): void {
    console.log('=== VOICE DEBUGGING ===');

    // Check if speechSynthesis is available
    if (!('speechSynthesis' in window)) {
      console.error('speechSynthesis not supported in this browser');
      return;
    }

    // Check voices immediately
    const voices = window.speechSynthesis.getVoices();
    console.log('Voices available immediately:', voices.length);
    console.log('Voice details:', voices);

    // Check if voices are still loading
    if (voices.length === 0) {
      console.log('No voices found immediately, checking if they load...');

      // Set up listener for when voices load
      window.speechSynthesis.onvoiceschanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        console.log('Voices loaded after event:', newVoices.length);
        console.log('New voice details:', newVoices);
      };

      // Try to trigger voice loading
      console.log('Attempting to trigger voice loading...');
      const testUtterance = new SpeechSynthesisUtterance('test');
      window.speechSynthesis.speak(testUtterance);
      window.speechSynthesis.cancel();
    }

    // Check the dropdown element
    setTimeout(() => {
      const voiceSelect = document.getElementById('speech-voice') as HTMLSelectElement;
      if (voiceSelect) {
        console.log('Voice dropdown found with options:', voiceSelect.options.length);
        console.log('Dropdown HTML:', voiceSelect.innerHTML);
      } else {
        console.error('Voice dropdown element not found!');
      }
    }, 500);

    console.log('=== END VOICE DEBUGGING ===');
  }

  /**
 * Install the settings functionality
 */
  install() {
    this.createModalContent();
  }

  /**
   * Uninstall the settings functionality
   */
  uninstall() {
  }
}

/**
 * Register CSS for the settings dialog
 */
Blockly.Css.register(`
.settings-modal {
  border: 1px solid var(--shortcut-modal-border-color, #9aa0a6);
  border-radius: 12px;
  box-shadow: 6px 6px 32px rgba(0,0,0,.5);
  flex-direction: column;
  gap: 12px;
  margin: auto;
  max-height: 82vh;
  max-width: calc(100% - 10em);
  padding: 24px;
  position: relative;
  z-index: 99;
  background: white;
}

.settings-modal[open] {
  display: flex;
}

.settings-modal .close-modal {
  border: 0;
  background: transparent;
  float: inline-end;
  margin: 0;
  position: absolute;
  top: 16px;
  right: 24px;
  cursor: pointer;
}

.settings-modal h1 {
  font-weight: 600;
  font-size: 1.2em;
  margin: 0 0 20px 0;
}

.settings-container {
  font-size: 0.95em;
  padding: 0.5em;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group label {
  font-weight: 500;
  font-size: 1em;
}

.setting-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
}

.setting-group input[type="range"]:focus {
  outline: 3px solid #ffa200;
}

.setting-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.setting-group select:focus {
  outline: 3px solid #ffa200;
  border-color: #ffa200;
}

.setting-description {
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.action-buttons button {
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95em;
  min-width: 120px;
}

.test-button {
  background: #e3f2fd;
  border-color: #2196f3;
}

.test-button:hover, .test-button:focus {
  background: #bbdefb;
  outline: 2px solid #ffa200;
}

.reset-button {
  background: #fff3e0;
  border-color: #ff9800;
}

.reset-button:hover, .reset-button:focus {
  background: #ffe0b2;
  outline: 2px solid #ffa200;
}

.save-button {
  background: #e8f5e8;
  border-color: #4caf50;
}

.save-button:hover, .save-button:focus {
  background: #c8e6c9;
  outline: 2px solid #ffa200;
}

.cancel-button {
  background: #ffebee;
  border-color: #f44336;
}

.cancel-button:hover, .cancel-button:focus {
  background: #ffcdd2;
  outline: 2px solid #ffa200;
}

/* Add this to your existing Blockly.Css.register section */

/* Simple dropdown styles */
.simple-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-button {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  text-align: left;
}

.dropdown-button:hover {
  border-color: #999;
}

.dropdown-button:focus {
  outline: 3px solid #ffa200;
  border-color: #ffa200;
}

.selected-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  margin-left: 8px;
  user-select: none;
  font-size: 0.8em;
}

.dropdown-listbox {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ffa200;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dropdown-listbox li {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  user-select: none;
}

.dropdown-listbox li:last-child {
  border-bottom: none;
}

.dropdown-listbox li:hover,
.dropdown-listbox li.selected {
  background-color: #e3f2fd;
}

.dropdown-listbox li.selected {
  background-color: #bbdefb;
  font-weight: 500;
}
  /* Checkbox styling */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 1em;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"]:focus {
  outline: 3px solid #ffa200;
  outline-offset: 2px;
}

.checkbox-text {
  user-select: none;
}

.checkbox-label:hover .checkbox-text {
  color: #333;
}
`);