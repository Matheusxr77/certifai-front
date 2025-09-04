import type { Event } from "../../indexModel";

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  event?: Event | null;
  isEditMode?: boolean;
}

export interface UseEventModalControllerProps {
  isOpen: boolean;
  isEditMode: boolean;
  event?: Event | null;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export interface EventModalControllerHook {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  errors: Record<string, string>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleOverlayClick: (e: React.MouseEvent) => void;
  validateForm: () => boolean;
}