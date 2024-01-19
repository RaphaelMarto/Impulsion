import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function socialLinkValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string | null = control.value ? control.value.toLowerCase() : null;

    if (value === null) {
      return null;
    } else if (
      (controlName === 'Spotify' && value.startsWith('https://open.spotify.com/')) ||
      (controlName === 'Youtube' && value.startsWith('https://www.youtube.com/')) ||
      (controlName === 'Facebook' && value.startsWith('https://www.facebook.com/')) ||
      (controlName === 'Soundcloud' && value.startsWith('https://soundcloud.com/'))
    ) {
      return null;
    } else {
      return { invalidLink: true };
    }
  };
}
