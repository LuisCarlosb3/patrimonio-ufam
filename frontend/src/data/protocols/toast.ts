export interface ToastMessage {
  type?: "success" | "error" | "warning";
  title: string;
  message: string;
  show?: boolean;
}

export interface ToastContextData {
  addToast(message: ToastMessage): void;
  removeToast(): void;
}
