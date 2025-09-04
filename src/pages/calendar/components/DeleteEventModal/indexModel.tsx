import type { Event } from "../../indexModel";

export interface DeleteEventModalProps {
  isOpen: boolean;
  event: Event | null;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export interface UseDeleteEventModalControllerProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export interface DeleteEventModalControllerHook {
  isLoading: boolean;
  handleDelete: () => Promise<void>;
  handleOverlayClick: (e: React.MouseEvent) => void;
}