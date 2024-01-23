import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function insturmentValidator(controlList: Array<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string | null = control.value ? control.value.charAt(0).toUpperCase() + control.value.toLowerCase().slice(1) : null;

    if (value === null) {
      return null;
    } else if (controlList.includes(value)) {
      return { invalidName: true };
    } else {
      return null;
    }
  };
}
