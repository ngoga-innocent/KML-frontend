// ui/loaderService.ts
type Listener = (state: boolean) => void;

class LoaderService {
  private listeners: Listener[] = [];
  private loading = false;

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    listener(this.loading);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show() {
    this.loading = true;
    this.emit();
  }

  hide() {
    this.loading = false;
    this.emit();
  }

  private emit() {
    this.listeners.forEach((l) => l(this.loading));
  }
}

export const loaderService = new LoaderService();