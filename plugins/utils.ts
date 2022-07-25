import Vue from "vue";
// ----- Flespi utils - START -----

/// Event buses

/**
 * EventBus to transmit data to component.
 */
export const eventBus = new Vue(); // creating an event bus.

/**
 * Generates a random ID
 */
export function generateRandomId (length: number): string {
    return "_" + Math.random().toString(36).substring(2, 2 + length);
}

// ----- Flespi utils - END -----
