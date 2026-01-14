import type { RouteLocationRaw } from "vue-router";

export interface AtomLinkProps {
  to?: string | RouteLocationRaw;
  nuxtLink?: boolean;
  newWindow?: boolean;
  exactActiveClass?: string;
  ariaLabel?: string;
}

export type AtomButtonType = "button" | "submit" | "reset";

export interface AtomButtonProps {
  active?: boolean;
  type?: AtomButtonType;
}

export interface AtomInputProps {
  modelValue?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  autocomplete?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
