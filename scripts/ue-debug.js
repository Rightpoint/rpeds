/**
 * Universal Editor Debug Instrumentation
 * Logs all Universal Editor events for debugging and development purposes.
 *
 * Events documented at:
 * https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/events
 */

const UE_DEBUG_PREFIX = '[UE Debug]';

/**
 * Style configurations for console logging
 */
const LOG_STYLES = {
  event: 'color: #2196F3; font-weight: bold;',
  content: 'color: #4CAF50; font-weight: bold;',
  ui: 'color: #FF9800; font-weight: bold;',
  data: 'color: #9C27B0;',
  timestamp: 'color: #757575; font-style: italic;',
  error: 'color: #F44336; font-weight: bold;',
};

/**
 * Get current timestamp for logging
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  return new Date().toISOString().split('T')[1].slice(0, -1);
}

/**
 * Log event with formatted output
 * @param {string} eventName - Name of the event
 * @param {string} category - Event category (content/ui)
 * @param {Object} detail - Event detail payload
 */
function logEvent(eventName, category, detail) {
  const style = category === 'content' ? LOG_STYLES.content : LOG_STYLES.ui;

  console.group(
    `%c${UE_DEBUG_PREFIX} %c${eventName} %c@ ${getTimestamp()}`,
    LOG_STYLES.event,
    style,
    LOG_STYLES.timestamp,
  );

  if (detail && Object.keys(detail).length > 0) {
    console.log('%cPayload:', LOG_STYLES.data, detail);

    // Log specific detail properties for easier debugging
    if (detail.resource) {
      console.log('  Resource:', detail.resource);
    }
    if (detail.updates) {
      console.log('  Updates:', detail.updates);
    }
    if (detail.content) {
      console.log('  Content:', detail.content);
    }
    if (detail.model) {
      console.log('  Model:', detail.model);
    }
    if (detail.patch) {
      console.log('  Patch:', detail.patch);
    }
    if (detail.request) {
      console.log('  Request:', detail.request);
    }
    if (detail.response) {
      console.log('  Response:', detail.response);
    }
    if (detail.from) {
      console.log('  From:', detail.from);
    }
    if (detail.to) {
      console.log('  To:', detail.to);
    }
    if (detail.before) {
      console.log('  Before:', detail.before);
    }
    if (detail.value !== undefined) {
      console.log('  Value:', detail.value);
    }
    if (detail.viewport) {
      console.log('  Viewport:', detail.viewport);
    }
    if (detail.width !== undefined || detail.height !== undefined) {
      console.log('  Dimensions:', { width: detail.width, height: detail.height });
    }
  } else {
    console.log('%cNo payload (empty event)', LOG_STYLES.timestamp);
  }

  console.groupEnd();
}

/**
 * Create event listener for a specific UE event
 * @param {string} eventName - Name of the event to listen for
 * @param {string} category - Event category for logging
 * @returns {Function} Event handler function
 */
function createEventListener(eventName, category) {
  return (event) => {
    logEvent(eventName, category, event.detail);
  };
}

/**
 * Universal Editor Content Events
 * These events are triggered when content is modified in the editor
 */
const CONTENT_EVENTS = [
  {
    name: 'aue:content-add',
    description: 'Triggered when a new component is added to a container',
  },
  {
    name: 'aue:content-details',
    description: 'Triggered when a component is loaded in the properties panel',
  },
  {
    name: 'aue:content-move',
    description: 'Triggered when a component is moved',
  },
  {
    name: 'aue:content-patch',
    description: 'Triggered when component data is updated in properties panel',
  },
  {
    name: 'aue:content-remove',
    description: 'Triggered when a component is removed from a container',
  },
  {
    name: 'aue:content-update',
    description: 'Triggered when component properties are updated in-context',
  },
];

/**
 * Universal Editor UI Events
 * These events are triggered when the editor UI state changes
 */
const UI_EVENTS = [
  {
    name: 'aue:ui-preview',
    description: 'Triggered when the editing mode changes to Preview',
  },
  {
    name: 'aue:ui-edit',
    description: 'Triggered when the editing mode changes to Edit',
  },
  {
    name: 'aue:ui-viewport-change',
    description: 'Triggered when viewport size is changed',
  },
  {
    name: 'aue:initialized',
    description: 'Notifies the remote page it loaded successfully in the Universal Editor',
  },
];

/**
 * Track event counts for summary reporting
 */
const eventCounts = {};

/**
 * Create event listener with count tracking
 * @param {string} eventName - Name of the event
 * @param {string} category - Event category
 * @returns {Function} Event handler function
 */
function createTrackedEventListener(eventName, category) {
  eventCounts[eventName] = 0;
  return (event) => {
    eventCounts[eventName] += 1;
    logEvent(eventName, category, event.detail);
  };
}

/**
 * Initialize all Universal Editor event listeners
 */
function initUEDebug() {
  console.log(
    `%c${UE_DEBUG_PREFIX} Initializing Universal Editor debug instrumentation...`,
    LOG_STYLES.event,
  );

  // Register content event listeners
  CONTENT_EVENTS.forEach(({ name, description }) => {
    document.addEventListener(name, createTrackedEventListener(name, 'content'));
    console.log(`%c  Listening for: ${name}`, LOG_STYLES.content);
    console.log(`%c    ${description}`, LOG_STYLES.timestamp);
  });

  // Register UI event listeners
  UI_EVENTS.forEach(({ name, description }) => {
    document.addEventListener(name, createTrackedEventListener(name, 'ui'));
    console.log(`%c  Listening for: ${name}`, LOG_STYLES.ui);
    console.log(`%c    ${description}`, LOG_STYLES.timestamp);
  });

  console.log(
    `%c${UE_DEBUG_PREFIX} Debug instrumentation ready. Listening for ${CONTENT_EVENTS.length + UI_EVENTS.length} events.`,
    LOG_STYLES.event,
  );

  // Add helper function to window for manual event summary
  window.ueDebugSummary = () => {
    console.group(`%c${UE_DEBUG_PREFIX} Event Summary`, LOG_STYLES.event);
    let totalEvents = 0;
    Object.entries(eventCounts).forEach(([event, count]) => {
      if (count > 0) {
        const style = event.includes('content') ? LOG_STYLES.content : LOG_STYLES.ui;
        console.log(`%c${event}: ${count}`, style);
        totalEvents += count;
      }
    });
    console.log(`%cTotal events captured: ${totalEvents}`, LOG_STYLES.data);
    console.groupEnd();
    return eventCounts;
  };

  // Add helper to clear event counts
  window.ueDebugReset = () => {
    Object.keys(eventCounts).forEach((key) => {
      eventCounts[key] = 0;
    });
    console.log(`%c${UE_DEBUG_PREFIX} Event counts reset`, LOG_STYLES.event);
  };

  // Add helper to simulate events for testing
  window.ueDebugSimulate = (eventName, detail = {}) => {
    const validEvents = [...CONTENT_EVENTS, ...UI_EVENTS].map((e) => e.name);
    if (!validEvents.includes(eventName)) {
      console.error(
        `%c${UE_DEBUG_PREFIX} Invalid event name. Valid events: ${validEvents.join(', ')}`,
        LOG_STYLES.error,
      );
      return;
    }
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
    console.log(`%c${UE_DEBUG_PREFIX} Simulated event: ${eventName}`, LOG_STYLES.event);
  };

  console.log(
    `%c${UE_DEBUG_PREFIX} Helper functions available:`,
    LOG_STYLES.event,
  );
  console.log('  - window.ueDebugSummary() : Show event count summary');
  console.log('  - window.ueDebugReset()   : Reset event counts');
  console.log('  - window.ueDebugSimulate(eventName, detail) : Simulate an event');
}

/**
 * Check if page is loaded in Universal Editor context
 * @returns {boolean} True if in UE context
 */
function isInUniversalEditor() {
  // Check if page is in an iframe (UE loads pages in iframe)
  const inIframe = window.self !== window.top;

  // Check for UE-specific URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasUEParams = urlParams.has('wcmmode') || urlParams.has('aue');

  // Check for UE-specific meta tags or attributes
  const hasUEAttributes = document.querySelector('[data-aue-resource]')
    || document.querySelector('[data-aue-type]');

  return inIframe || hasUEParams || hasUEAttributes;
}

/**
 * Initialize debug instrumentation
 * Only initializes if in Universal Editor context or debug mode is forced
 */
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const forceDebug = urlParams.get('ue-debug') === 'true';

  if (forceDebug || isInUniversalEditor()) {
    initUEDebug();
  } else {
    console.log(
      `%c${UE_DEBUG_PREFIX} Not in Universal Editor context. Add ?ue-debug=true to force enable.`,
      LOG_STYLES.timestamp,
    );
  }
}

// Auto-initialize
init();

export {
  initUEDebug,
  isInUniversalEditor,
  CONTENT_EVENTS,
  UI_EVENTS,
};
