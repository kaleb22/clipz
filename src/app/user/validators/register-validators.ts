import { ValidationErrors, AbstractControl } from "@angular/forms";

export class RegisterValidators {

  static match(group: AbstractControl): ValidationErrors | null {
    const passwordControl = group.get("password");
    const confirmPasswordControl = group.get("confirmPassword");

    if(!passwordControl || !confirmPasswordControl) {
      return {
        controlNotFound: false
      }
    }

    return passwordControl.value === confirmPasswordControl.value ? null : { noMatch: true }
  }
}
