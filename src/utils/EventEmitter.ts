type Listener = (...args: any[]) => void;

class EventEmitter {
  private events: { [key: string]: Listener[] } = {};

  on(event: string, listener: Listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listenerToRemove: Listener) {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(listener => listener(...args));
  }
}

export const globalEventEmitter = new EventEmitter();