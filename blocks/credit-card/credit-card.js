import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Mock subscribe function for debugging purposes.
 * In a real AEM Forms implementation, this would be imported from:
 * import { subscribe } from '../../form/rules/index.js';
 *
 * The subscribe function connects a form field element to the forms runtime
 * and allows you to react to model changes.
 */
const fieldModels = new Map();
const subscribers = new Map();

function createFieldModel(fieldJson) {
  const model = {
    _value: fieldJson.value || null,
    _enum: fieldJson.enum || [],
    _subscribers: [],

    get value() {
      return this._value;
    },
    set value(newValue) {
      const oldValue = this._value;
      this._value = newValue;
      console.debug('[FieldModel] Value changed:', { oldValue, newValue });
      this._notifySubscribers({
        payload: {
          changes: [{ propertyName: 'value', currentValue: newValue, previousValue: oldValue }],
        },
      });
    },

    get enum() {
      return this._enum;
    },
    set enum(newEnum) {
      const oldEnum = this._enum;
      this._enum = newEnum;
      console.debug('[FieldModel] Enum changed:', { oldEnum, newEnum });
      this._notifySubscribers({
        payload: {
          changes: [{ propertyName: 'enum', currentValue: newEnum, previousValue: oldEnum }],
        },
      });
    },

    subscribe(callback) {
      console.debug('[FieldModel] New subscriber added');
      this._subscribers.push(callback);
      return () => {
        this._subscribers = this._subscribers.filter((cb) => cb !== callback);
      };
    },

    _notifySubscribers(event) {
      this._subscribers.forEach((cb) => cb(event));
    },
  };

  return model;
}

/**
 * Subscribe function - connects DOM element to form model
 * @param {HTMLElement} element - The field DOM element
 * @param {string} formId - The form ID
 * @param {Function} callback - Callback receiving (fieldDiv, fieldModel)
 */
export function subscribe(element, formId, callback) {
  console.debug('[Subscribe] Subscribing element to form:', { element, formId });

  // Get or create the field model
  const fieldId = element.dataset.fieldId || `field-${Date.now()}`;
  element.dataset.fieldId = fieldId;

  let fieldModel = fieldModels.get(fieldId);
  if (!fieldModel) {
    // Parse fieldJson from element data or create default
    const fieldJson = element.dataset.fieldJson
      ? JSON.parse(element.dataset.fieldJson)
      : { enum: [] };
    fieldModel = createFieldModel(fieldJson);
    fieldModels.set(fieldId, fieldModel);
  }

  // Execute callback with field element and model
  callback(element, fieldModel);

  console.debug('[Subscribe] Subscription complete for field:', fieldId);
}

/**
 * Creates credit card selection UI
 * @param {HTMLElement} element - Container element
 * @param {Array} enums - Card options from field model
 */
function createCreditCards(element, enums) {
  console.debug('[CreditCard] Creating cards with enum:', enums);

  // Clear existing radio wrappers
  const existingWrappers = element.querySelectorAll('.radio-wrapper');
  existingWrappers.forEach((wrapper) => wrapper.remove());

  // Create radio buttons for each card option
  enums.forEach((cardOption, index) => {
    const radioWrapper = document.createElement('div');
    radioWrapper.classList.add('radio-wrapper');

    // Create radio input
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = element.dataset.fieldId || 'credit-card';
    input.id = `card-${index}`;
    input.dataset.index = index;
    input.value = cardOption.name || cardOption;

    // Create label
    const label = document.createElement('label');
    label.setAttribute('for', `card-${index}`);
    label.textContent = cardOption.name || cardOption;

    // Create card details container
    const cardDetails = document.createElement('div');
    cardDetails.classList.add('card-details');

    // Add card ending digits if available
    if (cardOption.lastFour) {
      const cardNumber = document.createElement('span');
      cardNumber.classList.add('card-number');
      cardNumber.textContent = `**** **** **** ${cardOption.lastFour}`;
      cardDetails.appendChild(cardNumber);
    }

    // Add card expiry if available
    if (cardOption.expiry) {
      const expiry = document.createElement('span');
      expiry.classList.add('card-expiry');
      expiry.textContent = `Exp: ${cardOption.expiry}`;
      cardDetails.appendChild(expiry);
    }

    // Add card image
    const imageUrl = cardOption.image || getDefaultCardImage(cardOption.type || 'generic');
    const image = createOptimizedPicture(imageUrl, `${cardOption.name || 'Card'} image`);
    image.classList.add('card-image');

    radioWrapper.appendChild(input);
    radioWrapper.appendChild(label);
    radioWrapper.appendChild(cardDetails);
    radioWrapper.appendChild(image);

    element.appendChild(radioWrapper);

    console.debug(`[CreditCard] Created card option ${index}:`, cardOption);
  });
}

/**
 * Returns default card image based on card type
 */
function getDefaultCardImage(type) {
  const cardImages = {
    visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    amex: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg',
    discover: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg',
    generic: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Credit_card_font_awesome.svg',
  };
  return cardImages[type.toLowerCase()] || cardImages.generic;
}

/**
 * Main decorate function for credit-card block
 * This follows the AEM Forms custom component pattern
 */
export default function decorate(block) {
  console.debug('[CreditCard] Decorating block:', block);

  // Add credit-card class
  block.classList.add('credit-card');

  // Get field configuration from block content or use defaults
  const fieldJson = parseBlockContent(block) || getDefaultFieldJson();

  // Store fieldJson on element for subscribe to access
  block.dataset.fieldJson = JSON.stringify(fieldJson);

  // Generate a form ID (in real implementation, this comes from the form container)
  const formId = block.closest('[data-form-id]')?.dataset.formId || `form-${Date.now()}`;

  // Create initial card UI
  createCreditCards(block, fieldJson.enum);

  // Subscribe to form model changes
  subscribe(block, formId, (fieldDiv, fieldModel) => {
    console.debug('[CreditCard] Subscribe callback executed:', { fieldDiv, fieldModel });

    // Subscribe to model changes
    fieldModel.subscribe((event) => {
      console.debug('[CreditCard] Model change event:', event);

      const { payload } = event;
      payload?.changes?.forEach((change) => {
        console.debug('[CreditCard] Processing change:', change);

        if (change?.propertyName === 'enum') {
          console.debug('[CreditCard] Enum changed, recreating cards');
          createCreditCards(block, change.currentValue);
        }

        if (change?.propertyName === 'value') {
          console.debug('[CreditCard] Value changed:', change.currentValue);
          // Update selected radio button
          const radios = block.querySelectorAll('input[type="radio"]');
          radios.forEach((radio) => {
            radio.checked = radio.value === change.currentValue;
          });
        }
      });
    });

    // Handle user selection
    block.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        e.stopPropagation();
        const selectedIndex = parseInt(e.target.dataset.index, 10);
        const selectedCard = fieldModel.enum?.[selectedIndex];
        console.debug('[CreditCard] User selected card:', { selectedIndex, selectedCard });
        fieldModel.value = selectedCard?.name || e.target.value;
      }
    });
  });

  // Add debug controls
  addDebugControls(block);

  console.debug('[CreditCard] Decoration complete');
  return block;
}

/**
 * Parse credit card options from block content
 */
function parseBlockContent(block) {
  const rows = block.querySelectorAll(':scope > div');
  if (rows.length === 0) return null;

  const cards = [];
  rows.forEach((row) => {
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length >= 1) {
      const card = {
        name: cols[0]?.textContent?.trim() || 'Card',
        type: cols[1]?.textContent?.trim() || 'generic',
        lastFour: cols[2]?.textContent?.trim() || '',
        expiry: cols[3]?.textContent?.trim() || '',
      };
      // Check for image
      const img = row.querySelector('img');
      if (img) {
        card.image = img.src;
      }
      cards.push(card);
    }
  });

  // Clear the original block content
  block.innerHTML = '';

  return cards.length > 0 ? { enum: cards } : null;
}

/**
 * Default field configuration for demo
 */
function getDefaultFieldJson() {
  return {
    enum: [
      {
        name: 'Visa ending in 4242',
        type: 'visa',
        lastFour: '4242',
        expiry: '12/25',
      },
      {
        name: 'Mastercard ending in 5555',
        type: 'mastercard',
        lastFour: '5555',
        expiry: '03/26',
      },
      {
        name: 'Amex ending in 0001',
        type: 'amex',
        lastFour: '0001',
        expiry: '06/27',
      },
    ],
  };
}

/**
 * Add debug controls for testing the subscribe pattern
 */
function addDebugControls(block) {
  const debugContainer = document.createElement('div');
  debugContainer.classList.add('credit-card-debug');

  const debugTitle = document.createElement('h4');
  debugTitle.textContent = 'Debug Controls';
  debugContainer.appendChild(debugTitle);

  // Button to add a new card
  const addCardBtn = document.createElement('button');
  addCardBtn.textContent = 'Add New Card (trigger enum change)';
  addCardBtn.addEventListener('click', () => {
    const fieldId = block.dataset.fieldId;
    const fieldModel = fieldModels.get(fieldId);
    if (fieldModel) {
      const newCard = {
        name: `New Card ${Date.now()}`,
        type: 'discover',
        lastFour: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        expiry: '12/28',
      };
      console.debug('[Debug] Adding new card:', newCard);
      fieldModel.enum = [...fieldModel.enum, newCard];
    }
  });
  debugContainer.appendChild(addCardBtn);

  // Button to clear selection
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Selection';
  clearBtn.addEventListener('click', () => {
    const fieldId = block.dataset.fieldId;
    const fieldModel = fieldModels.get(fieldId);
    if (fieldModel) {
      console.debug('[Debug] Clearing selection');
      fieldModel.value = null;
    }
  });
  debugContainer.appendChild(clearBtn);

  // Log current state button
  const logStateBtn = document.createElement('button');
  logStateBtn.textContent = 'Log Current State';
  logStateBtn.addEventListener('click', () => {
    const fieldId = block.dataset.fieldId;
    const fieldModel = fieldModels.get(fieldId);
    console.log('[Debug] Current Field State:', {
      fieldId,
      value: fieldModel?.value,
      enum: fieldModel?.enum,
      subscriberCount: fieldModel?._subscribers?.length,
    });
  });
  debugContainer.appendChild(logStateBtn);

  block.appendChild(debugContainer);
}

// Export for external access/debugging
export { fieldModels, createFieldModel };
