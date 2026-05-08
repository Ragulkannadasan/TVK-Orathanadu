import { EventEmitter } from "events";

// Global event bus for real-time updates (works in local development)
if (!global.chatEmitter) {
  global.chatEmitter = new EventEmitter();
  // Increase limit to handle multiple users
  global.chatEmitter.setMaxListeners(100);
}

export const chatEmitter = global.chatEmitter;
