import type { RouteLocationRaw } from "vue-router";

export interface AtomLinkProps {
  to?: string | RouteLocationRaw;
  nuxtLink?: boolean;
  newWindow?: boolean;
  exactActiveClass?: string;
  ariaLabel?: string;
}

export type AtomButtonType = "button" | "submit" | "reset";

export type AtomButtonTone = "slate" | "indigo";

export interface AtomButtonProps {
  active?: boolean;
  type?: AtomButtonType;
  tone?: AtomButtonTone;
}

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
