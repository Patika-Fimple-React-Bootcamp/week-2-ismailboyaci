export class Debouncer {
    constructor(delay) {
      this.delay = delay;
      this.timeoutId;
    }
  
    debounce(func, ...args) {
      clearTimeout(this.timeoutId);
  
      this.timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, this.delay);
    }
  }
  