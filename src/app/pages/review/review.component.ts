import { Component, ViewChild } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { Character } from '../../data/character';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

  currentStepIndex: number = 0;
  characters: Character[] = [];
  initialized: boolean = false;

  inputFormControl = new FormControl('', [this.createValidator()]);
  errorStateMatcher = new CustomErrorStateMatcher();
  
  @ViewChild('inputForm', { static: true }) inputForm: NgForm | undefined;

  ngOnInit() {
    // mockup
    this.characters = [
      {
        simplified: '大',
        traditional: '大',
        pinyin: [ 'dà' ],
      },
      {
        simplified: '人',
        traditional: '人',
        pinyin: [ 'rén' ],
      },
      {
        simplified: '有',
        traditional: '有',
        pinyin: [ 'yŏu' ],
      },
    ];
    this.initialized = true;
  }

  onStepChange(event: StepperSelectionEvent) {
    this.inputFormControl.setValue('');
    this.inputFormControl.reset();
  }

  createValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return {required: true};
      }

      const character = this.characters[this.currentStepIndex];
      if (character.pinyin.includes(value)) {
        return null;
      }

      const suggestions = character.pinyin.filter(s => {
        return this.removeDiacritics(s) == this.removeDiacritics(value)
      });
      if (suggestions.length > 0) {
        return {
          partial: true,
          suggestions,
        };
      }
      return {wrong: true};
    }
  }

  removeDiacritics(s: string) {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  onSubmit(event: SubmitEvent) {
    this.inputFormControl.markAsPristine();
  }
}

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && !control.dirty);
  }
}