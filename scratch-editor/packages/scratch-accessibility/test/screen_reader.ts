// /**
//  * @license
//  * Copyright 2024 Google LLC
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import * as Blockly from 'blockly';
// import { getToolboxElement, getFlyoutElement } from '../src/workspace_utilities';
// import { getBlockMessage } from './block_descriptions';
// import { SpeechSettings } from './settings_dialog';

// /**
//  * A simple screen reader implementation for Blockly that announces actions.
//  */
// export class ScreenReader {
//   private workspace: Blockly.WorkspaceSvg;
//   private lastAnnouncedBlockId: string | null = null;
//   private cursorInterval: number | null = null;
//   private lastWorkspaceNodeId: string | null = null;
//   private isSpeaking: boolean = false;
//   private debugMode: boolean = true;
//   private isEnabled: boolean = true;

//   private menuObservers?: {
//     menuObserver: MutationObserver | null;
//     contextMenuObserver: MutationObserver | null;
//   };

//   private currentUtterance: SpeechSynthesisUtterance | null = null;
//   private utteranceStartTime: number = 0;
//   private minSpeakTime: number = 500; // Minimum time in ms to speak before allowing interruption
//   private interruptionDelay: number = 300; // Grace period before interrupting
//   private pendingMessage: string | null = null;
//   private interruptionTimer: number | null = null;
//   private hasLeftWorkspace: boolean = false;

//   private isDeletingAll: boolean = false;
//   private settings: SpeechSettings;
//   private selectedVoice: SpeechSynthesisVoice | null = null;



//   /**
//    * Constructs a new ScreenReader instance.
//    * @param workspace The Blockly workspace to attach to.
//    */
//   constructor(workspace: Blockly.WorkspaceSvg) {
//     this.workspace = workspace;
//     this.debugLog('Initializing ScreenReader...');

//     // Initialize speech synthesis properly
//     this.initializeSpeechSynthesis();

//     // Initialize all event listeners
//     this.initEventListeners();

//     this.settings = this.loadSettings();
//     this.applyVoiceSettings();

//     // Setup workspace cursor listener
//     this.setupWorkspaceCursorListener();

//     this.setupFieldEditingListeners();
//   }

//   /**
//    * Load settings from localStorage with defaults
//    */
//   private loadSettings(): SpeechSettings {
//     const saved = localStorage.getItem('blockly-screenreader-settings');
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch (e) {
//         console.warn('Failed to parse saved settings, using defaults');
//       }
//     }

//     return this.getDefaultSettings();
//   }

//   /**
//    * Get default settings
//    */
//   private getDefaultSettings(): SpeechSettings {
//     return {
//       enabled: true,
//       rate: 1.7,
//       pitch: 1.0,
//       volume: 1.0,
//       voiceIndex: 0
//     };
//   }

//   /**
//    * Apply voice settings
//    */
//   private applyVoiceSettings(): void {
//     const voices = window.speechSynthesis.getVoices();
//     this.selectedVoice = voices[this.settings.voiceIndex] || voices[0] || null;
//   }

//   /**
//    * Update settings (called from settings dialog)
//    */
//   public updateSettings(newSettings: SpeechSettings): void {
//     this.settings = { ...newSettings };
//     this.setEnabled(newSettings.enabled);
//     this.applyVoiceSettings();
//   }

//   /**
//    * Test speech settings with a message
//    */
//   public testSpeechSettings(message: string): void {
//     // Force speak the test message with current settings
//     this.forceSpeek(message);
//   }


//   /**
//    * Initialize speech synthesis with proper voice loading
//    */
//   private initializeSpeechSynthesis(): void {
//     if ('speechSynthesis' in window) {
//       // Force voices to load
//       let voices = window.speechSynthesis.getVoices();

//       if (voices.length === 0) {
//         // Voices not loaded yet, wait for them
//         window.speechSynthesis.onvoiceschanged = () => {
//           voices = window.speechSynthesis.getVoices();
//           this.debugLog(`Loaded ${voices.length} voices`);
//           this.applyVoiceSettings(); // Apply voice settings after voices load
//           this.testSpeechAfterVoicesLoaded();
//         };
//       } else {
//         this.applyVoiceSettings(); // Apply voice settings immediately
//         this.testSpeechAfterVoicesLoaded();
//       }
//     }
//   }
//   /**
//    * Test speech after voices are loaded
//    */
//   private testSpeechAfterVoicesLoaded(): void {
//     setTimeout(() => {
//       this.speak('Screen reader enabled. Press Tab to navigate between controls. Use arrow keys within menus.');
//     }, 100);
//   }

//   /**
//    * Debug logging function
//    */
//   private debugLog(message: string): void {
//     if (this.debugMode) {
//       console.log(`[ScreenReader] ${message}`);
//     }
//   }

//   private setupDropdownNavigation(): void {
//     this.debugLog('Setting up dropdown navigation listeners...');

//     // Generic handler for all select elements
//     const handleSelectNavigation = (select: HTMLSelectElement) => {
//       // Mark as handled to prevent duplicate announcements
//       if (select.hasAttribute('data-dropdown-handled')) {
//         return;
//       }
//       select.setAttribute('data-dropdown-handled', 'true');

//       // Announce when dropdown receives focus
//       select.addEventListener('focus', () => {
//         const label = this.findLabelForElement(select);
//         const currentOption = select.options[select.selectedIndex]?.text || 'No selection';
//         this.speak(`${label} dropdown. Currently selected: ${currentOption}. Use arrow keys to navigate options.`);
//       });

//       // Announce when selection changes
//       select.addEventListener('change', () => {
//         const selectedOption = select.options[select.selectedIndex]?.text;
//         const label = this.findLabelForElement(select);
//         if (selectedOption) {
//           this.speak(`${label} changed to ${selectedOption}`);
//         }
//       });
//     };

//     // Setup for scenario dropdown
//     const scenarioDropdown = document.getElementById('scenario') as HTMLSelectElement;
//     if (scenarioDropdown) {
//       this.debugLog('Found scenario dropdown');
//       handleSelectNavigation(scenarioDropdown);
//     }

//     // Setup for toolbox dropdown
//     const toolboxDropdown = document.getElementById('toolbox') as HTMLSelectElement;
//     if (toolboxDropdown) {
//       this.debugLog('Found toolbox dropdown');
//       handleSelectNavigation(toolboxDropdown);
//     }

//     // Setup for renderer dropdown
//     const rendererDropdown = document.getElementById('renderer') as HTMLSelectElement;
//     if (rendererDropdown) {
//       this.debugLog('Found renderer dropdown');
//       handleSelectNavigation(rendererDropdown);
//     }
//   }

//   // Helper method to get friendly names for emojis
//   private getEmojiName(emoji: string): string {
//     const emojiMap: { [key: string]: string } = {
//       '❤️': 'red heart',
//       '✨': 'sparkles',
//       '🐻': 'bear face',
//       '🌟': 'glowing star',
//       '🌈': 'rainbow',
//       '🎈': 'balloon',
//       '🎨': 'artist palette',
//       '🌺': 'hibiscus flower',
//       '🦋': 'butterfly',
//       '🌙': 'crescent moon'
//     };

//     return emojiMap[emoji] || `emoji ${emoji}`;
//   }
//   /**
//  * Convert mathematical and special symbols to readable text
//  */
//   private cleanTextForScreenReader(text: string): string {
//     // First, remove any invisible Unicode characters like RTL/LTR marks
//     let cleanText = text
//       .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // Remove directional marks
//       .trim();

//     // Handle complex mathematical expressions FIRST before checking individual symbols

//     // Handle expressions like "10^" and "e^"
//     if (cleanText === '10^') {
//       return '10 to the power of';
//     }
//     if (cleanText === 'e^') {
//       return 'e to the power of';
//     }

//     // Handle sqrt() function format
//     if (cleanText.startsWith('sqrt(') && cleanText.endsWith(')')) {
//       const content = cleanText.slice(5, -1); // Remove "sqrt(" and ")"
//       if (content === '2') {
//         return 'square root of 2';
//       } else if (content === '1/2') {
//         return 'square root of one half';
//       } else {
//         return `square root of ${content}`;
//       }
//     }

//     // Handle # in context - check for phrases first
//     if (cleanText.includes('#')) {
//       // Replace # with "number" in common phrases
//       cleanText = cleanText
//         .replace(/^#/, 'number') // # at start
//         .replace(/\s#\s/g, ' number ') // # with spaces around it
//         .replace(/\s#$/g, ' number') // # at end with space before
//         .replace(/#\sfrom\sthe\send/g, 'number from the end')
//         .replace(/#\sfrom\send/g, 'number from end')
//         .replace(/#\sfrom\sstart/g, 'number from start');

//       // If we made replacements, return the result
//       if (cleanText !== text.trim()) {
//         return cleanText;
//       }
//     }

//     // Handle other mathematical functions with parentheses
//     if (cleanText.includes('(') && cleanText.includes(')')) {
//       // Replace function names with readable versions
//       cleanText = cleanText
//         .replace(/^sin\(/i, 'sine of ')
//         .replace(/^cos\(/i, 'cosine of ')
//         .replace(/^tan\(/i, 'tangent of ')
//         .replace(/^asin\(/i, 'arcsine of ')
//         .replace(/^acos\(/i, 'arccosine of ')
//         .replace(/^atan\(/i, 'arctangent of ')
//         .replace(/^ln\(/i, 'natural logarithm of ')
//         .replace(/^log\(/i, 'logarithm of ')
//         .replace(/^abs\(/i, 'absolute value of ')
//         .replace(/\)$/, ''); // Remove closing parenthesis

//       return cleanText;
//     }

//     // Mathematical operators - ORDER MATTERS! Check longer symbols first
//     const symbolMap: { [key: string]: string } = {
//       // List/Array symbols - moved to top for priority
//       '#': 'number',

//       // Comparison operators - check two-character operators first
//       '<=': 'less than or equal',
//       '≤': 'less than or equal',
//       '>=': 'greater than or equal',
//       '≥': 'greater than or equal',
//       '≠': 'not equal',
//       '!=': 'not equal',

//       // Then single character operators
//       '=': 'equals',
//       '<': 'less than',
//       '>': 'greater than',

//       // Mathematical operators
//       '+': 'plus',
//       '-': 'minus',
//       '×': 'times',
//       '*': 'times',
//       '÷': 'divided by',
//       '/': 'divided by',
//       '^': 'to the power of',
//       '√': 'square root',
//       '∛': 'cube root',

//       // Logic operators
//       '&&': 'and',
//       '||': 'or',
//       '∧': 'and',
//       '∨': 'or',
//       '¬': 'not',
//       '!': 'not',

//       // Mathematical constants
//       'π': 'pi',
//       'e': 'e',
//       '∞': 'infinity',
//       'φ': 'phi',
//       '√2': 'square root of 2',
//       '√½': 'square root of one half',

//       // Trigonometric functions (short forms)
//       'sin': 'sine',
//       'cos': 'cosine',
//       'tan': 'tangent',
//       'asin': 'arcsine',
//       'acos': 'arccosine',
//       'atan': 'arctangent',

//       // Other mathematical functions
//       'ln': 'natural logarithm',
//       'log₁₀': 'log base 10',
//       'log10': 'log base 10',
//       'eˣ': 'e to the x',
//       '10ˣ': '10 to the x',

//       // Special characters
//       '%': 'percent',
//       '°': 'degrees',
//       '∈': 'is in',
//       '∉': 'is not in',
//       '∅': 'empty set',
//       '[]': 'empty list',

//       // Greek letters often used in math
//       'α': 'alpha',
//       'β': 'beta',
//       'γ': 'gamma',
//       'δ': 'delta',
//       'θ': 'theta',
//       'λ': 'lambda',
//       'μ': 'mu',
//       'σ': 'sigma',
//       'Σ': 'sum',
//       'Π': 'product'
//     };

//     // Check for exact match with cleaned text
//     if (symbolMap[cleanText]) {
//       return symbolMap[cleanText];
//     }

//     // For single/double character symbols, return the translation
//     if (cleanText.length <= 2) {
//       // Check if it's a known symbol
//       for (const [symbol, readable] of Object.entries(symbolMap)) {
//         if (cleanText === symbol) {
//           return readable;
//         }
//       }
//     }

//     // Handle subscript numbers (like log₁₀)
//     let readableText = cleanText;
//     readableText = readableText.replace(/₀/g, ' sub 0')
//       .replace(/₁/g, ' sub 1')
//       .replace(/₂/g, ' sub 2')
//       .replace(/₃/g, ' sub 3')
//       .replace(/₄/g, ' sub 4')
//       .replace(/₅/g, ' sub 5')
//       .replace(/₆/g, ' sub 6')
//       .replace(/₇/g, ' sub 7')
//       .replace(/₈/g, ' sub 8')
//       .replace(/₉/g, ' sub 9');

//     // Handle superscript (like x²)
//     readableText = readableText.replace(/²/g, ' squared')
//       .replace(/³/g, ' cubed')
//       .replace(/ⁿ/g, ' to the n')
//       .replace(/ˣ/g, ' to the x');

//     return readableText || text;
//   };

//   /**
//    * Set up comprehensive Blockly menu listeners with better symbol handling
//    */
//   private setupComprehensiveMenuListeners(): void {
//     this.debugLog('Setting up comprehensive menu listeners...');

//     // State tracking
//     let menuObserver: MutationObserver | null = null;
//     let lastAnnouncedMenuItem: string = '';
//     let menuItemCount: number = 0;
//     let currentMenuIndex: number = -1;
//     let monitorInterval: number | null = null;
//     let isMenuOpen: boolean = false;
//     let hasAnnouncedMenuOpen: boolean = false;

//     /**
//      * Extract and process menu item text
//      */
//     const getMenuItemText = (element: Element): string => {
//       let text = '';

//       // For dropdown menu items, try multiple strategies to get the full text

//       // Strategy 1: Look for .blocklyMenuItemContent
//       const contentSpan = element.querySelector('.blocklyMenuItemContent');
//       if (contentSpan) {
//         // Get all text content including child nodes
//         text = contentSpan.textContent?.trim() || '';

//         // If that didn't work, try getting innerHTML and stripping tags
//         if (!text || text === 'sqrt') {
//           const innerHTML = contentSpan.innerHTML;
//           // Strip HTML tags but preserve text
//           text = innerHTML.replace(/<[^>]*>/g, '').trim();
//         }
//       }

//       // Strategy 2: If no content span or text is incomplete, try the element itself
//       if (!text || text === 'sqrt') {
//         // Get all text nodes within the element
//         const walker = document.createTreeWalker(
//           element,
//           NodeFilter.SHOW_TEXT
//         );

//         let textContent = '';
//         let node;
//         while (node = walker.nextNode()) {
//           if (node.nodeValue) {
//             textContent += node.nodeValue;
//           }
//         }

//         if (textContent.trim()) {
//           text = textContent.trim();
//         }
//       }

//       // Strategy 3: Last resort - use textContent on the whole element
//       if (!text || text === 'sqrt') {
//         text = element.textContent?.trim() || '';
//       }

//       // Debug log the raw text
//       this.debugLog(`Raw menu text: "${text}"`);

//       // Remove any keyboard shortcut hints (usually in parentheses at the end)
//       text = text.replace(/\s*\(.*?\)\s*$/, '').trim();

//       // Convert symbols to readable text
//       const converted = this.cleanTextForScreenReader(text);

//       // Debug log to see what we're converting
//       if (text !== converted) {
//         this.debugLog(`Converting "${text}" to "${converted}"`);
//       } else {
//         this.debugLog(`No conversion for "${text}"`);
//       }

//       return converted || 'Unknown menu item';
//     };

//     // Also, let's add a special check in the announceMenuItem function to handle these cases:
//     const announceMenuItem = (item: Element, index: number, total: number) => {
//       let text = getMenuItemText(item);

//       // Special handling for math constants that might be abbreviated
//       if (text === 'sqrt' || text === '√') {
//         // Try to get more context by looking at the full element structure
//         const fullText = item.textContent?.trim() || '';
//         this.debugLog(`Full element text for sqrt item: "${fullText}"`);

//         // Check for common patterns
//         if (fullText.includes('sqrt(2)') || fullText.includes('√2')) {
//           text = 'square root of 2';
//         } else if (fullText.includes('sqrt(1/2)') || fullText.includes('√½')) {
//           text = 'square root of one half';
//         } else if (fullText.includes('sqrt')) {
//           // Extract what's after sqrt
//           const match = fullText.match(/sqrt\(([^)]+)\)/);
//           if (match && match[1]) {
//             text = `square root of ${match[1]}`;
//           }
//         }
//       }

//       const isDisabled = item.classList.contains('blocklyMenuItemDisabled') ||
//         item.classList.contains('blocklyContextMenuDisabled');

//       // Create a unique key for this announcement
//       const announcementKey = `${text}-${index}`;

//       if (announcementKey !== lastAnnouncedMenuItem) {
//         lastAnnouncedMenuItem = announcementKey;
//         const position = total > 1 ? `, ${index + 1} of ${total}` : '';
//         const status = isDisabled ? ' (disabled)' : '';

//         // Use high priority speech for menu navigation
//         this.speakHighPriority(`${text}${status}${position}`);
//       }
//     };

//     /**
//      * Monitor dropdown menus for changes
//      */
//     const monitorDropdownMenu = () => {
//       const dropdownDiv = document.querySelector('.blocklyDropDownDiv') as HTMLElement;

//       if (dropdownDiv && dropdownDiv.style.display !== 'none') {
//         // Find all menu items
//         const menuItems = dropdownDiv.querySelectorAll('.blocklyMenuItem');
//         const newMenuItemCount = menuItems.length;

//         // Only update if count changed
//         if (newMenuItemCount !== menuItemCount) {
//           menuItemCount = newMenuItemCount;
//         }

//         // Look for highlighted item
//         const highlightedItem = dropdownDiv.querySelector('.blocklyMenuItemHighlight');
//         if (highlightedItem) {
//           const index = Array.from(menuItems).indexOf(highlightedItem);
//           if (index !== -1 && index !== currentMenuIndex) {
//             currentMenuIndex = index;
//             announceMenuItem(highlightedItem, index, menuItemCount);
//           }
//         }
//       } else if (isMenuOpen) {
//         // Menu was just closed
//         isMenuOpen = false;
//         hasAnnouncedMenuOpen = false;
//         lastAnnouncedMenuItem = '';
//         currentMenuIndex = -1;
//         this.speak('Menu closed');
//         if (monitorInterval) {
//           clearInterval(monitorInterval);
//           monitorInterval = null;
//         }
//       }
//     };

//     // Set up mutation observer for dropdown menus
//     menuObserver = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         // Check for dropdown div visibility changes
//         if (mutation.target instanceof HTMLElement) {
//           if (mutation.target.classList.contains('blocklyDropDownDiv')) {
//             const isVisible = mutation.target.style.display !== 'none';

//             if (isVisible && !isMenuOpen) {
//               isMenuOpen = true;
//               hasAnnouncedMenuOpen = false;
//               lastAnnouncedMenuItem = '';
//               currentMenuIndex = -1;

//               // Announce menu opening only once
//               if (!hasAnnouncedMenuOpen) {
//                 hasAnnouncedMenuOpen = true;
//                 setTimeout(() => {
//                   const menuItems = (mutation.target as HTMLElement).querySelectorAll('.blocklyMenuItem');
//                   const itemCount = menuItems.length;

//                   if (itemCount > 0) {
//                     this.speak(`Menu opened with ${itemCount} items. Use arrow keys to navigate.`);

//                     // Clear any existing monitor interval
//                     if (monitorInterval) {
//                       clearInterval(monitorInterval);
//                       monitorInterval = null;
//                     }

//                     // Start monitoring for changes
//                     monitorInterval = window.setInterval(() => {
//                       monitorDropdownMenu();
//                     }, 50);

//                     // Clear after 30 seconds to prevent memory leaks
//                     setTimeout(() => {
//                       if (monitorInterval) {
//                         clearInterval(monitorInterval);
//                         monitorInterval = null;
//                       }
//                     }, 30000);
//                   }
//                 }, 100);
//               }
//             }
//           }
//         }

//         // Also check for class changes on menu items (for highlighting)
//         if (mutation.type === 'attributes' &&
//           mutation.attributeName === 'class' &&
//           isMenuOpen) {
//           const target = mutation.target as HTMLElement;
//           if (target.classList.contains('blocklyMenuItem') &&
//             target.classList.contains('blocklyMenuItemHighlight')) {
//             const menuItems = target.parentElement?.querySelectorAll('.blocklyMenuItem');
//             if (menuItems) {
//               const index = Array.from(menuItems).indexOf(target);
//               if (index !== -1 && index !== currentMenuIndex) {
//                 currentMenuIndex = index;
//                 announceMenuItem(target, index, menuItems.length);
//               }
//             }
//           }
//         }
//       });
//     });

//     // Start observing
//     menuObserver.observe(document.body, {
//       childList: true,
//       subtree: true,
//       attributes: true,
//       attributeFilter: ['class', 'style']
//     });

//     // Enhanced keyboard navigation for menus
//     document.addEventListener('keydown', (e) => {
//       if (!isMenuOpen) return;

//       const dropdownDiv = document.querySelector('.blocklyDropDownDiv') as HTMLElement;
//       const dropdownVisible = dropdownDiv?.style.display !== 'none';

//       if (dropdownVisible) {
//         if (e.key === 'Escape') {
//           this.speak('Closing menu');
//         } else if (e.key === 'Enter' || e.key === ' ') {
//           const highlightedItem = document.querySelector('.blocklyMenuItemHighlight');
//           if (highlightedItem) {
//             const itemText = getMenuItemText(highlightedItem);
//             this.speak(`Selected ${itemText}`);
//           }
//         }
//       }
//     });

//     // Store observer for cleanup
//     this.menuObservers = { menuObserver, contextMenuObserver: null };
//   }

//   /**
//    * Set up listener for toolbox selection changes
//    */
//   private setupToolboxSelectionListener(): void {
//     // Listen for the Blockly event that fires when toolbox selection changes
//     this.workspace.addChangeListener((event: Blockly.Events.Abstract) => {
//       // Blockly fires a TOOLBOX_ITEM_SELECT event when selection changes
//       if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
//         const selectEvent = event as Blockly.Events.ToolboxItemSelect;
//         const toolbox = this.workspace.getToolbox();

//         if (!toolbox || !(toolbox instanceof Blockly.Toolbox)) return;

//         // Get the selected item
//         const selectedItem = toolbox.getSelectedItem();
//         if (selectedItem && 'getName' in selectedItem && typeof selectedItem.getName === 'function') {
//           const categoryName = selectedItem.getName();
//           const firstLetter = categoryName.charAt(0).toUpperCase();

//           // Now we know toolbox is a Blockly.Toolbox, so getToolboxItems() exists
//           const allItems = toolbox.getToolboxItems();
//           const matchingItems = allItems.filter((item: Blockly.IToolboxItem) => {
//             if ('getName' in item && typeof item.getName === 'function') {
//               return item.getName().toUpperCase().startsWith(firstLetter) &&
//                 item.isSelectable();
//             }
//             return false;
//           });

//           if (matchingItems.length > 1) {
//             // Find the index of current selection among matching items
//             const currentIndex = matchingItems.findIndex((item: Blockly.IToolboxItem) => item === selectedItem) + 1;
//             this.speakHighPriority(
//               `${categoryName} category, ${currentIndex} of ${matchingItems.length} starting with ${firstLetter}`
//             );
//           } else {
//             this.speakHighPriority(`${categoryName} category selected`);
//           }
//         }
//       }
//     });
//   }


//   /**
//    * Initialize event listeners for workspace changes.
//    */
//   private initEventListeners(): void {
//     this.debugLog('Initializing event listeners...');

//     this.setupComprehensiveMenuListeners();

//     this.setupToolboxSelectionListener();

//     // Listen for flyout events
//     const flyout = this.workspace.getFlyout();
//     if (flyout) {
//       const flyoutWorkspace = flyout.getWorkspace();

//       // Check for cursor changes in the flyout workspace
//       setInterval(() => {
//         const cursor = flyoutWorkspace.getCursor();
//         if (cursor) {
//           const curNode = cursor.getCurNode();
//           if (curNode) {
//             const block = curNode.getSourceBlock();
//             if (block) {
//               // Store the last announced block ID to avoid repeating
//               if (!this.lastAnnouncedBlockId || this.lastAnnouncedBlockId !== block.id) {
//                 this.lastAnnouncedBlockId = block.id;

//                 // Cast to BlockSvg since flyout blocks are always SVG blocks
//                 const blockSvg = block as Blockly.BlockSvg;

//                 // Get position info
//                 const position = this.getBlockPositionInFlyout(blockSvg);
//                 const blockDescription = this.getBlockDescription(block);

//                 if (position) {
//                   this.speak(`${position.index} of ${position.total}, ${blockDescription}`);
//                 } else {
//                   this.speak(blockDescription);
//                 }
//               }
//             }
//           }
//         }
//       }, 500); // Check every 500ms 
//     }

//     // keyboard event listener to detect Tab key navigation
//     document.addEventListener('keydown', (e) => {
//       // Check if Tab key was pressed
//       if (e.key === 'Tab') {
//         this.debugLog('Tab key detected');
//         // Give a small delay to let the focus settle
//         // Mark that we might be leaving the workspace
//         const currentActive = document.activeElement;
//         if (currentActive === this.workspace.getParentSvg() ||
//           this.workspace.getParentSvg().contains(currentActive as Node)) {
//           // We're currently in the workspace, so tabbing might take us out
//           this.hasLeftWorkspace = true;
//         }

//         setTimeout(() => {
//           // Check what element is now focused
//           const activeElement = document.activeElement;
//           this.debugLog(`Active element after Tab: ${activeElement?.tagName} ${activeElement?.id}`);

//           // Check if the toolbox has focus
//           const toolboxElement = getToolboxElement(this.workspace);
//           // if (toolboxElement && toolboxElement.contains(activeElement)) {
//           //   this.speak("Toolbox focused.");
//           // }
//         }, 100);
//       }

//     });

//     // Add listener for workspace action shortcuts (C for cleanup, D for delete all)
//     document.addEventListener('keydown', (e) => {
//       // Only handle if we're focused on the workspace
//       const workspaceHasFocus = document.activeElement === this.workspace.getParentSvg() ||
//         this.workspace.getParentSvg().contains(document.activeElement as Node);

//       if (!workspaceHasFocus) return;

//       // Don't trigger if modifiers are pressed (except shift for capitals)
//       if (e.ctrlKey || e.metaKey || e.altKey) return;

//       // Check if workspace is editable
//       if (this.workspace.options.readOnly) return;

//       switch (e.key.toLowerCase()) {
//         case 'c':
//           // Clean up workspace
//           const blocksToClean = this.workspace.getTopBlocks(false).length;
//           if (blocksToClean > 0) {
//             // The actual cleanup will be handled by the navigation controller
//             // We just announce the action after a brief delay to ensure it happened
//             setTimeout(() => {
//               this.forceSpeek(`Cleaned up workspace. blocks organized.`);
//             }, 150);
//           }
//           break;

//         // 3. Update your keyboard shortcut handler for 'D':
//         case 'd':
//           // Delete all blocks
//           // Set flag to suppress individual delete announcements
//           this.isDeletingAll = true;

//           // Announce immediately
//           this.forceSpeek('All blocks are deleted');

//           // Reset the flag after 500ms
//           setTimeout(() => {
//             this.isDeletingAll = false;
//           }, 1000);

//           break;
//       }
//     });

//     this.setupDropdownNavigation();

//     // Listen for block selection changes
//     this.workspace.addChangeListener((event: Blockly.Events.Abstract) => {
//       if (event.type === Blockly.Events.SELECTED) {
//         const selectedEvent = event as Blockly.Events.Selected;
//         this.debugLog(`Block selected: ${selectedEvent.newElementId}`);
//         if (selectedEvent.newElementId) {
//           const block = this.workspace.getBlockById(selectedEvent.newElementId);
//           if (block) {
//             this.announceBlock(block);
//           }
//         } else {
//           this.speak("No block selected");
//         }
//       } else if (event.type === Blockly.Events.BLOCK_CREATE) {
//         const createEvent = event as Blockly.Events.BlockCreate;
//         this.debugLog(`Block created: ${createEvent.blockId}`);
//         if (createEvent.blockId) {
//           const block = this.workspace.getBlockById(createEvent.blockId);
//           if (block) {
//             this.speak(`${this.getBlockDescription(block)} added to the workspace`);
//           }
//         }
//       } else if (event.type === Blockly.Events.BLOCK_DELETE) {
//         const deleteEvent = event as Blockly.Events.BlockDelete;
//         this.debugLog('Block deleted');

//         // If we're in delete all mode, don't announce individual deletes
//         if (this.isDeletingAll) {
//           return;
//         }

//         // Only announce individual deletions
//         this.speak("Block deleted");
//       } else if (event.type === Blockly.Events.BLOCK_CHANGE) {
//         const changeEvent = event as Blockly.Events.BlockChange;
//         this.debugLog(`Block changed: ${changeEvent.blockId}`);
//         if (changeEvent.blockId) {
//           const block = this.workspace.getBlockById(changeEvent.blockId);
//           if (block) {
//             this.speak(`Block changed to ${this.getBlockDescription(block)}`);
//           }
//         }
//       }
//     });




//     // Flyout focus
//     const flyoutElement = getFlyoutElement(this.workspace);
//     if (flyoutElement) {
//       flyoutElement.addEventListener('focus', () => {
//         this.debugLog('Flyout focused');
//         this.speak("Blocks menu focused.");
//         this.hasLeftWorkspace = true;
//       });

//       flyoutElement.addEventListener('blur', () => {
//         this.debugLog('Flyout blurred');
//       });

//       // Listen for flyout events
//       const flyout = this.workspace.getFlyout();
//       if (flyout) {
//         const flyoutWorkspace = flyout.getWorkspace();

//         // Check for cursor changes in the flyout workspace
//         setInterval(() => {
//           const cursor = flyoutWorkspace.getCursor();
//           if (cursor) {
//             const curNode = cursor.getCurNode();
//             if (curNode) {
//               const block = curNode.getSourceBlock();
//               if (block) {
//                 // Store the last announced block ID to avoid repeating
//                 if (!this.lastAnnouncedBlockId || this.lastAnnouncedBlockId !== block.id) {
//                   this.lastAnnouncedBlockId = block.id;
//                   this.speak(`${this.getBlockDescription(block)}`);
//                 }
//               }
//             }
//           }
//         }, 500); // Check every 500ms 
//       }
//     }

//     /**
//  * Improved focus event handling for better form control announcements
//  */
//     document.addEventListener('focusin', (e) => {
//       const target = e.target as HTMLElement;
//       this.debugLog(`Focus changed to: ${target.tagName} ${target.id || target.className || 'unnamed'}`);

//       // Skip if this element has already been handled by specific handlers
//       if (target.hasAttribute('data-dropdown-handled') ||
//         target.hasAttribute('data-screen-reader-handled')) {
//         return;
//       }

//       // Handle toolbox category group FIRST, before other cases
//       if (target.classList.contains('blocklyToolboxCategoryGroup') &&
//         target.getAttribute('role') === 'tree') {
//         // Find the currently selected category
//         const selectedItem = target.querySelector('[aria-selected="true"]');
//         const categoryName = selectedItem?.textContent?.trim() || 'first category';
//         this.speak(`Blocks menu categories. ${categoryName} selected. Use arrow keys to navigate.`);

//         // Set up arrow key navigation for this specific element
//         if (!target.hasAttribute('data-arrow-handler')) {
//           target.setAttribute('data-arrow-handler', 'true');
//           target.addEventListener('keydown', (event) => {
//             const ke = event as KeyboardEvent;
//             if (ke.key === 'ArrowUp' || ke.key === 'ArrowDown') {
//               setTimeout(() => {
//                 const newSelected = target.querySelector('[aria-selected="true"]');
//                 if (newSelected) {
//                   this.speak(newSelected.textContent?.trim() || 'Unknown category');
//                 }
//               }, 50);
//             }
//           });
//         }

//         return; // Skip the default case
//       }

//       // Handle different types of form controls
//       switch (target.tagName) {
//         case 'BUTTON':
//           const buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown button';
//           this.speak(`${buttonText} button`);
//           break;

//         case 'SELECT':
//           // Only announce if not already handled by setupDropdownNavigation
//           const select = target as HTMLSelectElement;
//           if (!select.hasAttribute('data-dropdown-handled')) {
//             const selectLabel = this.findLabelForElement(select);
//             const currentSelection = select.options[select.selectedIndex]?.text || 'No selection';

//             // Check if this is a Blockly field dropdown
//             if (select.classList.contains('blocklyDropdown') || select.closest('.blocklyDropdownDiv')) {
//               this.speak(`Block dropdown: ${selectLabel || 'Field selector'}. Currently: ${currentSelection}. Use arrow keys to navigate.`);
//             } else {
//               this.speak(`${selectLabel} dropdown. Currently selected: ${currentSelection}. Use arrow keys to navigate.`);
//             }
//           }
//           break;
//         case 'INPUT':
//           const input = target as HTMLInputElement;
//           const inputLabel = this.findLabelForElement(input);

//           switch (input.type) {
//             case 'checkbox':
//               const checkboxState = input.checked ? 'Checked' : 'Not checked';
//               this.speak(`Checkbox: ${inputLabel}. ${checkboxState}. Press space to toggle.`);
//               break;

//             case 'radio':
//               const radioState = input.checked ? 'Selected' : 'Not selected';
//               this.speak(`Radio button: ${inputLabel}. ${radioState}`);
//               break;

//             case 'text':
//             case 'number':
//               const currentValue = input.value || 'Empty';
//               this.speak(`${input.type === 'number' ? 'Number' : 'Text'} input: ${inputLabel}. Current value: ${currentValue}`);
//               break;

//             default:
//               this.speak(`Input field: ${inputLabel || input.type}`);
//           }
//           break;

//         case 'TEXTAREA':
//           const textarea = target as HTMLTextAreaElement;
//           const textareaLabel = this.findLabelForElement(textarea);
//           const textContent = textarea.value || 'Empty';
//           this.speak(`Text area: ${textareaLabel}. Current content: ${textContent}`);
//           break;

//         default:
//           // Check if it's a focusable div or other element with a role
//           const role = target.getAttribute('role');
//           const ariaLabel = target.getAttribute('aria-label');

//           // if (role || ariaLabel) {
//           //   this.speak(`${role || 'Element'}: ${ariaLabel || 'Interactive element'}`);
//           // }
//           // Don't announce every div focus, only meaningful ones
//           break;
//       }
//     });

//     // Listen specifically for the "Disable stack connections" checkbox
//     const noStackCheckbox = document.getElementById('noStack');
//     if (noStackCheckbox) {
//       noStackCheckbox.addEventListener('change', (e) => {
//         const checkbox = e.target as HTMLInputElement;
//         this.speak(`Disable stack connections: ${checkbox.checked ? 'Checked' : 'Unchecked'}`);
//       });
//     }
//   }

//   /**
//  * Enhanced field editing announcements for screen_reader.ts
//  */
//   private fieldEditingListeners: Map<string, {
//     input: HTMLInputElement;
//     lastValue: string;
//     keydownListener: (e: KeyboardEvent) => void;
//     inputListener: (e: Event) => void;
//   }> = new Map();

//   /**
//    * Set up an interval to check for workspace cursor movements
//    */
//   private setupWorkspaceCursorListener(): void {
//     this.debugLog('Setting up workspace cursor listener...');

//     // Clear any existing interval
//     if (this.cursorInterval) {
//       clearInterval(this.cursorInterval);
//       this.cursorInterval = null;
//     }

//     // Set up an interval to check for cursor changes in the main workspace
//     this.cursorInterval = window.setInterval(() => {
//       const cursor = this.workspace.getCursor();
//       if (cursor) {
//         const curNode = cursor.getCurNode();
//         if (curNode) {
//           // Track if we've already announced this node
//           const currentNodeId = this.getNodeIdentifier(curNode);

//           // Check if workspace has focus - if not, we might need to re-announce when it regains focus
//           const workspaceHasFocus = document.activeElement === this.workspace.getParentSvg() ||
//             this.workspace.getParentSvg().contains(document.activeElement as Node);

//           if (this.lastWorkspaceNodeId !== currentNodeId ||
//             (workspaceHasFocus && this.hasLeftWorkspace)) {
//             this.lastWorkspaceNodeId = currentNodeId;
//             this.announceNode(curNode);

//             // Reset the flag if we've announced after returning
//             if (this.hasLeftWorkspace && workspaceHasFocus) {
//               this.hasLeftWorkspace = false;
//             }
//           }
//         }
//       }
//     }, 250); // Check every 250ms for better responsiveness
//   }

//   /**
//    * Generate a unique identifier for a node to avoid repeating announcements
//    */
//   private getNodeIdentifier(node: Blockly.ASTNode): string {
//     const type = node.getType();
//     const location = node.getLocation();

//     if (type === Blockly.ASTNode.types.BLOCK) {
//       const block = location as Blockly.Block;
//       return `block-${block?.id || 'unknown'}`;
//     } else if (type === Blockly.ASTNode.types.WORKSPACE) {
//       return 'workspace';
//     } else if (type === Blockly.ASTNode.types.STACK) {
//       const block = location as Blockly.Block;
//       return `stack-${block?.id || 'unknown'}`;
//     } else if (node.isConnection()) {
//       const connection = location as Blockly.Connection;
//       const block = connection.getSourceBlock();
//       return `connection-${block?.id || 'unknown'}-${connection.type}`;
//     } else if (type === Blockly.ASTNode.types.FIELD) {
//       const field = location as Blockly.Field;
//       const block = field.getSourceBlock();
//       return `field-${block?.id || 'unknown'}-${field.name}`;
//     } else if (type === Blockly.ASTNode.types.INPUT) {
//       const input = location as Blockly.Input;
//       const block = input.getSourceBlock();
//       return `input-${block?.id || 'unknown'}-${input.name}`;
//     } else {
//       return `unknown-${type}`;
//     }
//   }

//   /**
//    * Find the label text for a form element
//    */
//   private findLabelForElement(element: HTMLElement): string {
//     // Try to find a label with a matching 'for' attribute
//     if (element.id) {
//       const label = document.querySelector(`label[for="${element.id}"]`);
//       if (label && label.textContent) {
//         return label.textContent.trim();
//       }
//     }

//     // Try to find a parent label element
//     let parent = element.parentElement;
//     while (parent) {
//       if (parent.tagName === 'LABEL' && parent.textContent) {
//         return parent.textContent.trim();
//       }
//       parent = parent.parentElement;
//     }

//     // Fallback to the element's id or a generic description
//     return element.id || "Unnamed element";
//   }

//   /**
//  * Announce information about a specific block.
//  * @param block The block to announce.
//  */
//   public announceBlock(block: Blockly.Block): void {
//     const description = this.getBlockDescription(block);

//     // Check if we're in the flyout
//     const blockSvg = block as Blockly.BlockSvg;
//     if (blockSvg.workspace.isFlyout) {
//       const position = this.getBlockPositionInFlyout(blockSvg);
//       if (position) {
//         this.speakHighPriority(`Selected ${position.index} of ${position.total}, ${description}`);
//         return;
//       }
//     }

//     this.speakHighPriority(`Selected ${description}`);
//   }
//   /**
//  * Enhanced getBlockDescription method to include field values
//  */
//   private getBlockDescription(block: Blockly.Block): string {
//     // Get variables from workspace for context
//     const workspace = block.workspace;
//     const variableMap = workspace.getVariableMap();
//     const allVariables = variableMap.getAllVariables();

//     // Map variables with the correct method
//     const variables = allVariables.map(variable => ({
//       name: variable.getName(),  // Use getName() method
//       id: variable.getId()
//     }));

//     // Try to get description from block_descriptions
//     const detailedDescription = getBlockMessage(block, variables);

//     // If we got a meaningful description, use it
//     if (!detailedDescription.startsWith('Block of type')) {
//       return detailedDescription;
//     }

//     // Fall back to your existing p5-specific descriptions
//     const blockType = block.type;

//     // For certain block types, provide more specific descriptions
//     if (blockType === 'p5_setup') {
//       return "Setup block";
//     } else if (blockType === 'p5_draw') {
//       return "Draw block";
//     } else if (blockType === 'p5_canvas') {
//       const width = block.getFieldValue('WIDTH');
//       const height = block.getFieldValue('HEIGHT');
//       return `Create Canvas with width ${width} and height ${height}`;
//     } else if (blockType === 'math_number') {
//       const value = block.getFieldValue('NUM');
//       return `Number block with value ${value}`;
//     } else if (blockType === 'draw_emoji') {
//       const emoji = block.getFieldValue('emoji');
//       const emojiName = this.getEmojiName(emoji);
//       return `Draw ${emojiName}`;
//     } else if (blockType === 'simple_circle') {
//       // Try to get the color from the connected color block
//       let colorName = "colored";

//       try {
//         const colorInput = block.getInput('COLOR');
//         if (colorInput && colorInput.connection && colorInput.connection.targetBlock()) {
//           const colorBlock = colorInput.connection.targetBlock();
//           if (colorBlock && colorBlock.type === 'colour_picker') {
//             const colorHex = colorBlock.getFieldValue('COLOUR');
//             colorName = this.getColorNameFromHex(colorHex);
//           }
//         }
//       } catch (e) {
//         console.log("Error getting circle color:", e);
//       }

//       return `Draw ${colorName} circle`;
//     } else if (blockType === 'p5_background_color') {
//       // Try to get the color from the connected color block
//       let colorName = "selected";

//       try {
//         const colorInput = block.getInput('COLOR');
//         if (colorInput && colorInput.connection && colorInput.connection.targetBlock()) {
//           const colorBlock = colorInput.connection.targetBlock();
//           if (colorBlock && colorBlock.type === 'colour_picker') {
//             const colorHex = colorBlock.getFieldValue('COLOUR');
//             colorName = this.getColorNameFromHex(colorHex);
//           }
//         }
//       } catch (e) {
//         console.log("Error getting background color:", e);
//       }

//       return `Set background color to ${colorName}`;
//     } else if (blockType === 'write_text_without_shadow') {
//       const text = block.getFieldValue('TEXT');
//       return `Write text "${text}" without shadow`;
//     } else if (blockType === 'write_text_with_shadow') {
//       // Try to determine the text content
//       let textContent = "selected text";

//       try {
//         const textInput = block.getInput('TEXT');
//         if (textInput && textInput.connection && textInput.connection.targetBlock()) {
//           const textBlock = textInput.connection.targetBlock();
//           if (textBlock && (textBlock.type === 'text' || textBlock.type === 'text_only')) {
//             textContent = textBlock.getFieldValue('TEXT');
//           }
//         }
//       } catch (e) {
//         console.log("Error getting shadow text:", e);
//       }

//       return `Write text "${textContent}" with shadow`;
//     } else if (blockType === 'colour_random') {
//       return "Generate random color";
//     } else if (blockType === 'colour_picker') {
//       const colorHex = block.getFieldValue('COLOUR');
//       const colorName = this.getColorNameFromHex(colorHex);
//       return `Color: ${colorName}`;
//     }

//     //Add field information for blocks with dropdowns or other editable fields
//     const fields = block.inputList
//       .flatMap(input => input.fieldRow)
//       .filter(field => field.EDITABLE && field.getValue);

//     let baseDescription = blockType.replace(/_/g, ' ');

//     if (fields.length > 0) {
//       const fieldDescriptions = fields.map(field => {
//         const fieldName = field.name || 'field';
//         let fieldValue = '';

//         // Get appropriate field value based on field type
//         if (field.getText) {
//           fieldValue = field.getText();
//         } else {
//           fieldValue = String(field.getValue());
//         }

//         // Special handling for dropdown fields with emojis
//         if (fieldName === 'emoji' && fieldValue) {
//           fieldValue = this.getEmojiName(fieldValue);
//         }

//         // Special handling for color fields
//         if ((fieldName.toLowerCase().includes('color') || fieldName.toLowerCase().includes('colour')) &&
//           fieldValue.startsWith('#')) {
//           fieldValue = this.getColorNameFromHex(fieldValue);
//         }

//         return `${fieldName}: ${fieldValue}`;
//       }).join(', ');

//       return `${baseDescription} block with ${fieldDescriptions}`;
//     }

//     // Default description
//     return blockType.replace(/_/g, ' ') + " block";
//   }


//   // Convert hex color to a name
//   private getColorNameFromHex(hexColor: string): string {
//     // Remove # if present
//     hexColor = hexColor.replace('#', '').toLowerCase();

//     // Extended color mapping
//     const colorMap: { [key: string]: string } = {
//       'ff0000': 'red',
//       'ff4500': 'orange-red',
//       'ffa500': 'orange',
//       'ffff00': 'yellow',
//       'adff2f': 'green-yellow',
//       '00ff00': 'green',
//       '008000': 'dark green',
//       '00ffff': 'cyan',
//       '0000ff': 'blue',
//       '000080': 'navy blue',
//       '4b0082': 'indigo',
//       '800080': 'purple',
//       '9400d3': 'dark violet',
//       'ff00ff': 'magenta',
//       'ff1493': 'deep pink',
//       'ffffff': 'white',
//       '000000': 'black',
//       'c0c0c0': 'silver',
//       '808080': 'gray',
//       'a52a2a': 'brown',
//       'f0e68c': 'khaki',
//       'd2b48c': 'tan',
//       '9932cc': 'dark orchid',
//       '98fb98': 'pale green',
//       'dda0dd': 'plum',
//       'f5f5dc': 'beige',
//       'ffe4c4': 'bisque',
//       'ffc0cb': 'pink'
//     };

//     // Check if the hex color is in our map
//     if (colorMap[hexColor]) {
//       return colorMap[hexColor];
//     }

//     // For unknown colors, try to categorize them by their components
//     try {
//       // Parse the hex color into RGB components
//       const r = parseInt(hexColor.substr(0, 2), 16);
//       const g = parseInt(hexColor.substr(2, 2), 16);
//       const b = parseInt(hexColor.substr(4, 2), 16);

//       // Check which component is dominant
//       if (r > g && r > b) {
//         if (g > b) return r - g > 50 ? 'reddish orange' : 'orange red';
//         return r - b > 50 ? 'bright red' : 'reddish purple';
//       } else if (g > r && g > b) {
//         if (r > b) return g - r > 50 ? 'yellowish green' : 'yellow green';
//         return g - b > 50 ? 'bright green' : 'greenish blue';
//       } else if (b > r && b > g) {
//         if (r > g) return b - r > 50 ? 'bluish purple' : 'purple blue';
//         return b - g > 50 ? 'bright blue' : 'teal blue';
//       } else if (r === g && g === b) {
//         // Grayscale
//         if (r > 200) return 'light gray';
//         if (r > 100) return 'gray';
//         return 'dark gray';
//       }
//     } catch (e) {
//       console.log("Error parsing color:", e);
//     }

//     // If all else fails
//     return 'custom color';
//   }

//   /**
//  * Get the position of a block within the flyout
//  */
//   private getBlockPositionInFlyout(block: Blockly.BlockSvg): { index: number, total: number } | null {
//     const flyout = this.workspace.getFlyout();
//     if (!flyout) return null;

//     // Get all blocks in the flyout
//     const flyoutWorkspace = flyout.getWorkspace();
//     const flyoutBlocks = flyoutWorkspace.getTopBlocks(false);

//     // Find the current block's position
//     let currentIndex = -1;
//     for (let i = 0; i < flyoutBlocks.length; i++) {
//       if (flyoutBlocks[i].id === block.id) {
//         currentIndex = i;
//         break;
//       }
//     }

//     if (currentIndex === -1) return null;

//     return {
//       index: currentIndex + 1, // 1-based indexing for users
//       total: flyoutBlocks.length
//     };
//   }

//   /**
//     * Enhanced speak method with intelligent interruption
//     * Replace the existing speak method
//     */
//   // Update the speak method to clear pending messages for high priority announcements
//   private speak(message: string, priority: 'high' | 'normal' = 'normal'): void {
//     // Log to console for debugging
//     this.debugLog(`Speaking: ${message} (priority: ${priority})`);

//     if (!('speechSynthesis' in window)) {
//       this.debugLog('speechSynthesis not available');
//       return;
//     }

//     if (!this.isEnabled) {
//       return; // Don't speak if disabled
//     }

//     // If there's a pending interruption, clear it
//     if (this.interruptionTimer) {
//       clearTimeout(this.interruptionTimer);
//       this.interruptionTimer = null;
//     }

//     // Clear pending messages for high priority announcements
//     // This prevents old navigation messages from playing when you stop moving
//     if (priority === 'high') {
//       this.pendingMessage = null;
//     }

//     // Check if we should interrupt the current speech
//     if (this.currentUtterance && window.speechSynthesis.speaking) {
//       const timeSpoken = Date.now() - this.utteranceStartTime;

//       // For high priority messages, interrupt more aggressively
//       if (priority === 'high' && timeSpoken > 200) {
//         // High priority can interrupt after just 200ms
//         this.interruptCurrentAndSpeak(message);
//         return;
//       }

//       // If the current message has been speaking for less than minimum time
//       if (timeSpoken < this.minSpeakTime) {
//         // Queue this message to be spoken after a delay
//         this.debugLog(`Delaying new message, current has only played for ${timeSpoken}ms`);

//         this.pendingMessage = message;
//         this.interruptionTimer = window.setTimeout(() => {
//           this.interruptCurrentAndSpeak(message);
//         }, this.minSpeakTime - timeSpoken + this.interruptionDelay);

//         return;
//       } else {
//         // Current message has played long enough, interrupt it
//         this.interruptCurrentAndSpeak(message);
//         return;
//       }
//     }

//     // No current speech, speak immediately
//     this.speakImmediate(message);
//   }

//   /**
//    * Interrupt current speech and speak new message
//    */
//   private interruptCurrentAndSpeak(message: string): void {
//     this.debugLog('Interrupting current speech');

//     // Clear any pending message since we're interrupting with a new one
//     this.pendingMessage = null;

//     // Cancel current speech
//     window.speechSynthesis.cancel();
//     this.currentUtterance = null;

//     // Small delay to ensure cancellation is processed
//     setTimeout(() => {
//       this.speakImmediate(message);
//     }, 50);
//   }

//   /**
//    * Immediately speak a message
//    */
//   private speakImmediate(message: string): void {
//     try {
//       const utterance = new SpeechSynthesisUtterance(message);

//       // Use current settings instead of hardcoded values
//       utterance.rate = this.settings.rate;
//       utterance.pitch = this.settings.pitch;
//       utterance.volume = this.settings.volume;

//       // Apply selected voice if available
//       if (this.selectedVoice) {
//         utterance.voice = this.selectedVoice;
//       }

//       // Track the current utterance and start time
//       this.currentUtterance = utterance;
//       this.utteranceStartTime = Date.now();

//       // Add event listeners (existing code)
//       utterance.onstart = () => {
//         this.debugLog(`Speech started: "${message}"`);
//         this.isSpeaking = true;
//       };

//       utterance.onend = () => {
//         this.debugLog(`Speech ended: "${message}"`);
//         this.isSpeaking = false;
//         this.currentUtterance = null;

//         // Check if there's a pending message
//         if (this.pendingMessage) {
//           const pending = this.pendingMessage;
//           this.pendingMessage = null;
//           this.speak(pending);
//         }
//       };

//       utterance.onerror = (event) => {
//         this.debugLog(`Speech error: ${event.error} for message: "${message}"`);
//         this.isSpeaking = false;
//         this.currentUtterance = null;
//       };

//       // Speak the utterance
//       window.speechSynthesis.speak(utterance);
//     } catch (error) {
//       this.debugLog(`Error creating speech utterance: ${error}`);
//     }
//   }

//   /**
//   * Force speak a message by clearing everything first (use sparingly)
//   * Update the existing forceSpeek method
//   */
//   public forceSpeek(message: string): void {
//     if (!this.isEnabled) {
//       this.debugLog(`Force speech blocked - screen reader disabled: "${message}"`);
//       return; // Don't speak if disabled
//     }
//     if ('speechSynthesis' in window) {
//       // Clear any pending interruptions
//       if (this.interruptionTimer) {
//         clearTimeout(this.interruptionTimer);
//         this.interruptionTimer = null;
//       }

//       // Clear pending messages
//       this.pendingMessage = null;

//       // Cancel all speech
//       window.speechSynthesis.cancel();
//       this.currentUtterance = null;

//       // Speak after a short delay
//       setTimeout(() => this.speakImmediate(message), 100);
//     }
//   }

//   /**
//    * Announce a high-priority message (interrupts more aggressively)
//    */
//   public speakHighPriority(message: string): void {
//     this.speak(message, 'high');
//   }

//   /**
//    * Update announceNode to use priority speech for navigation
//    */
//   private announceNode(node: Blockly.ASTNode): void {
//     const type = node.getType();
//     const location = node.getLocation();

//     // ALL navigation announcements should be high priority to clear pending messages
//     if (type === Blockly.ASTNode.types.BLOCK || type === Blockly.ASTNode.types.STACK) {
//       const block = (type === Blockly.ASTNode.types.STACK
//         ? location
//         : location) as Blockly.BlockSvg;

//       if (block) {
//         const description = this.getBlockDescription(block);

//         // Check if block is in flyout
//         if (block.workspace.isFlyout) {
//           const position = this.getBlockPositionInFlyout(block);
//           if (position) {
//             this.speakHighPriority(`${position.index} of ${position.total}, ${description}`);
//             return;
//           }
//         }

//         this.speakHighPriority(`Selected ${description}`);
//       } else {
//         this.speakHighPriority("Unknown block");
//       }
//     } else if (type === Blockly.ASTNode.types.WORKSPACE) {
//       this.speakHighPriority("Workspace. Use arrow keys to navigate blocks.");
//     } else if (type === Blockly.ASTNode.types.STACK) {
//       const block = location as Blockly.Block;
//       if (block) {
//         this.speakHighPriority(`Block stack starting with ${this.getBlockDescription(block)}`);
//       } else {
//         this.speakHighPriority("Unknown block stack");
//       }
//     } else if (node.isConnection()) {
//       const connection = location as Blockly.Connection;
//       const block = connection.getSourceBlock();

//       if (!block) {
//         this.speakHighPriority("Connection on unknown block");
//         return;
//       }

//       // All connection announcements should also be high priority during navigation
//       if (connection.type === Blockly.PREVIOUS_STATEMENT) {
//         this.speakHighPriority(`Top of ${this.getBlockDescription(block)}`);
//       } else if (connection.type === Blockly.NEXT_STATEMENT) {
//         this.speakHighPriority(`Bottom of ${this.getBlockDescription(block)}. Connect a block here.`);
//       } else if (connection.type === Blockly.OUTPUT_VALUE) {
//         this.speakHighPriority(`Output connection of ${this.getBlockDescription(block)}`);
//       } else if (connection.type === Blockly.INPUT_VALUE) {
//         this.speakHighPriority(`Value input on ${this.getBlockDescription(block)}. Connect a value here.`);
//       }
//     } else if (type === Blockly.ASTNode.types.FIELD) {
//       const field = location as Blockly.Field;

//       // Get the field value and clean it for screen reader
//       let fieldValue = field.getText();
//       fieldValue = this.cleanTextForScreenReader(fieldValue);

//       // Check if this is a dropdown field
//       const isDropdown = field instanceof Blockly.FieldDropdown;

//       if (isDropdown) {
//         this.speakHighPriority(`Dropdown with value ${fieldValue}. Press Enter to open menu.`);
//       } else {
//         this.speakHighPriority(`Field with value ${fieldValue}`);
//       }
//     } else if (type === Blockly.ASTNode.types.INPUT) {
//       const input = location as Blockly.Input;
//       const block = input.getSourceBlock();
//       if (block) {
//         this.speakHighPriority(`Input ${input.name} on ${this.getBlockDescription(block)}`);
//       } else {
//         this.speakHighPriority(`Input ${input.name} on unknown block`);
//       }
//     } else {
//       this.speakHighPriority(`Unknown element type: ${type}`);
//     }
//   }

//   /**
//  * Enable or disable the screen reader
//  */
//   public setEnabled(enabled: boolean): void {
//     this.isEnabled = enabled;
//     if (!enabled) {
//       // Cancel any pending speech when disabled
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }
//       this.currentUtterance = null;
//       this.pendingMessage = null;
//     }
//   }

//   /**
//    * Check if screen reader is enabled before speaking
//    */
//   public isScreenReaderEnabled(): boolean {
//     return this.isEnabled;
//   }

//   /**
//    * Update the dispose method to clean up timers
//    */
//   public dispose(): void {
//     this.debugLog('Disposing screen reader...');

//     this.disposeFieldEditingListeners();

//     if (this.cursorInterval) {
//       clearInterval(this.cursorInterval);
//       this.cursorInterval = null;
//     }

//     if (this.interruptionTimer) {
//       clearTimeout(this.interruptionTimer);
//       this.interruptionTimer = null;
//     }

//     // Clean up menu observers
//     if (this.menuObservers) {
//       if (this.menuObservers.menuObserver) {
//         this.menuObservers.menuObserver.disconnect();
//       }
//       if (this.menuObservers.contextMenuObserver) {
//         this.menuObservers.contextMenuObserver.disconnect();
//       }
//     }

//     // Cancel any pending speech
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//   }

//   /**
//    * Reset speech synthesis if it gets stuck
//    */
//   public resetSpeechSynthesis(): void {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       setTimeout(() => {
//         this.speak('Speech synthesis reset');
//       }, 200);
//     }
//   }

//   /**
//  * Set up field editing listeners for text and number inputs
//  */
//   private setupFieldEditingListeners(): void {
//     this.debugLog('Setting up field editing listeners...');

//     // Use MutationObserver to detect when Blockly input fields are created
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         mutation.addedNodes.forEach((node) => {
//           if (node instanceof HTMLElement) {
//             // Look for Blockly input fields
//             const inputs = node.querySelectorAll('input[type="text"], input[type="number"]');
//             inputs.forEach((input) => {
//               if (input instanceof HTMLInputElement &&
//                 input.classList.contains('blocklyHtmlInput')) {
//                 this.attachFieldEditingListener(input);
//               }
//             });

//             // Also check if the node itself is an input
//             if (node instanceof HTMLInputElement &&
//               node.classList.contains('blocklyHtmlInput')) {
//               this.attachFieldEditingListener(node);
//             }
//           }
//         });
//       });
//     });

//     // Start observing the document for new input fields
//     observer.observe(document.body, {
//       childList: true,
//       subtree: true
//     });
//   }

//   /**
//    * Attach editing listeners to a specific input field
//    */
//   private attachFieldEditingListener(input: HTMLInputElement): void {
//     const inputId = this.generateInputId(input);

//     // Don't attach if already attached
//     if (this.fieldEditingListeners.has(inputId)) {
//       return;
//     }

//     this.debugLog(`Attaching field editing listener to input: ${inputId}`);

//     let lastValue = input.value;
//     let isBackspaceOrDelete = false;

//     const keydownListener = (e: KeyboardEvent) => {
//       // Track if backspace or delete was pressed
//       isBackspaceOrDelete = e.key === 'Backspace' || e.key === 'Delete';
//       lastValue = input.value;
//     };

//     const inputListener = (e: Event) => {
//       const currentValue = input.value;
//       this.announceFieldChange(lastValue, currentValue, isBackspaceOrDelete);
//       lastValue = currentValue;
//       isBackspaceOrDelete = false;
//     };

//     // Store listeners for cleanup
//     this.fieldEditingListeners.set(inputId, {
//       input,
//       lastValue,
//       keydownListener,
//       inputListener
//     });

//     // Attach listeners
//     input.addEventListener('keydown', keydownListener);
//     input.addEventListener('input', inputListener);

//     // Clean up when input loses focus or is removed
//     const cleanupListener = () => {
//       this.removeFieldEditingListener(inputId);
//     };

//     input.addEventListener('blur', cleanupListener);
//     input.addEventListener('remove', cleanupListener);
//   }

//   /**
//    * Generate a unique ID for an input field
//    */
//   private generateInputId(input: HTMLInputElement): string {
//     return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }

//   /**
//    * Announce the character that was added or removed from a field
//    */
//   private announceFieldChange(oldValue: string, newValue: string, wasDelete: boolean): void {
//     this.debugLog(`Field change: "${oldValue}" -> "${newValue}", wasDelete: ${wasDelete}`);

//     // Handle deletion
//     if (newValue.length < oldValue.length) {
//       const deletedChars = oldValue.slice(newValue.length);
//       for (const char of deletedChars) {
//         const announcement = this.getCharacterAnnouncement(char);
//         this.speakHighPriority(`Deleted ${announcement}`);
//       }
//       return;
//     }

//     // Handle addition
//     if (newValue.length > oldValue.length) {
//       const addedChars = newValue.slice(oldValue.length);
//       for (const char of addedChars) {
//         const announcement = this.getCharacterAnnouncement(char);
//         this.speakHighPriority(announcement);
//       }
//       return;
//     }

//     // Handle replacement (same length but different content)
//     if (oldValue !== newValue && oldValue.length === newValue.length) {
//       // Find the changed character
//       for (let i = 0; i < newValue.length; i++) {
//         if (oldValue[i] !== newValue[i]) {
//           const announcement = this.getCharacterAnnouncement(newValue[i]);
//           this.speakHighPriority(announcement);
//           break;
//         }
//       }
//     }
//   }

//   /**
//    * Get the screen reader announcement for a character
//    */
//   private getCharacterAnnouncement(char: string): string {
//     // Numbers
//     const numbers: { [key: string]: string } = {
//       '0': 'zero',
//       '1': 'one',
//       '2': 'two',
//       '3': 'three',
//       '4': 'four',
//       '5': 'five',
//       '6': 'six',
//       '7': 'seven',
//       '8': 'eight',
//       '9': 'nine'
//     };

//     // Special characters
//     const specialChars: { [key: string]: string } = {
//       '.': 'dot',
//       ',': 'comma',
//       '-': 'minus',
//       '+': 'plus',
//       ' ': 'space',
//       '(': 'left parenthesis',
//       ')': 'right parenthesis',
//       '[': 'left bracket',
//       ']': 'right bracket',
//       '{': 'left brace',
//       '}': 'right brace',
//       '=': 'equals',
//       '<': 'less than',
//       '>': 'greater than',
//       '/': 'slash',
//       '\\': 'backslash',
//       '*': 'asterisk',
//       '%': 'percent',
//       '#': 'hash',
//       '@': 'at',
//       '&': 'ampersand',
//       '!': 'exclamation',
//       '?': 'question mark',
//       ':': 'colon',
//       ';': 'semicolon',
//       '"': 'quote',
//       "'": 'apostrophe',
//       '`': 'backtick',
//       '~': 'tilde',
//       '^': 'caret',
//       '_': 'underscore',
//       '|': 'pipe'
//     };

//     // Check if it's a number
//     if (numbers[char]) {
//       return numbers[char];
//     }

//     // Check if it's a special character
//     if (specialChars[char]) {
//       return specialChars[char];
//     }

//     // For letters, just return the letter (screen readers handle these well)
//     if (/[a-zA-Z]/.test(char)) {
//       return char.toLowerCase();
//     }

//     // For anything else, return the character itself
//     return char;
//   }

//   /**
//    * Remove field editing listener for a specific input
//    */
//   private removeFieldEditingListener(inputId: string): void {
//     const listener = this.fieldEditingListeners.get(inputId);
//     if (listener) {
//       listener.input.removeEventListener('keydown', listener.keydownListener);
//       listener.input.removeEventListener('input', listener.inputListener);
//       this.fieldEditingListeners.delete(inputId);
//       this.debugLog(`Removed field editing listener: ${inputId}`);
//     }
//   }

//   /**
//    * Clean up all field editing listeners (call this in dispose())
//    */
//   private disposeFieldEditingListeners(): void {
//     this.fieldEditingListeners.forEach((listener, inputId) => {
//       this.removeFieldEditingListener(inputId);
//     });
//     this.fieldEditingListeners.clear();
//   }


// }
