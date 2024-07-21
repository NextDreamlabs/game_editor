export class Input {
  static keysDown: Set<string> = new Set();

  static isKeyDown(key: string): boolean {
    return Input.keysDown.has(key);
  }

  static onKeyDown(event: KeyboardEvent): void {
    console.log(event.key, 'event.key')
    Input.keysDown.add(event.key);
  }

  static onKeyUp(event: KeyboardEvent): void {
    Input.keysDown.delete(event.key);
  }

  // Add a new static method to listen for key events
  static listenForKeys(): void {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }
}