import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {

  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passwordControl = group.get(controlName);
      const confirmPasswordControl = group.get(matchingControlName);
  
      if(!passwordControl || !confirmPasswordControl) {
        return {
          controlNotFound: false
        }
      }
  
      return passwordControl.value === confirmPasswordControl.value ? null : { noMatch: true }
    }
  }
}
