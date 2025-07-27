import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber    = /[0-9]/.test(value);
  const hasSymbol    = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValidLength = value.length >= 8;

  const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSymbol && isValidLength;

  return passwordValid ? null : { weakPassword: true };
}
