import type { RouteLocationRaw } from "vue-router";

export interface AtomLinkProps {
  to?: string | RouteLocationRaw;
  nuxtLink?: boolean;
  newWindow?: boolean;
  exactActiveClass?: string;
  ariaLabel?: string;
}

export type AtomButtonType = "button" | "submit" | "reset";

export type AtomButtonTone = "slate" | "indigo" | "rose";

export interface AtomButtonProps {
  active?: boolean;
  type?: AtomButtonType;
  tone?: AtomButtonTone;
}

export type AtomInputEmits = {
  (event: "update:modelValue", value: string): void;
};

export interface AtomInputProps {
  modelValue?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  autocomplete?: string;
  disabled?: boolean;
  maxLength?: number;
  ariaLabel?: string;
}
