import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ErrorStateMatcher } from '@angular/material/core';
import { ReviewItem } from '../../data/review-item';
import { ReviewItemType } from '../../enums/review-item-type';
import {MatChipsModule} from '@angular/material/chips';


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
    MatChipsModule,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

  currentStepIndex: number = 0;
  reviewItems: ReviewItem[] = [];
  initialized: boolean = false;
  submitted: boolean = false;

  inputFormControl = new FormControl('', [this.createValidator()]);
  customErrorStateMatcher = new CustomErrorStateMatcher();

  ReviewItemType = ReviewItemType;
  
  @ViewChild('inputForm') inputForm: NgForm | undefined;

  ngOnInit() {
    // mockup
    this.reviewItems = [
      {
        type: ReviewItemType.Pinyin,
        flashcard: {
          simplified: '大',
          traditional: '大',
          pinyin: [ 'dà' ],
          english: [ 'large' ],
        },
        level: 0,
      },
      {
        type: ReviewItemType.Pinyin,
        flashcard: {
          simplified: '大',
          traditional: '大',
          pinyin: [ 'dà' ],
          english: [ 'large' ],
        },
        level: 0,
      },
      {
        type: ReviewItemType.Character,
        flashcard: {
          simplified: '有',
          traditional: '有',
          pinyin: [ 'yŏu' ],
          english: [ 'have' ],
        },
        level: 0,
        options: [
          {
            simplified: '有',
            traditional: '有',
            pinyin: [ 'yŏu' ],
            english: [ 'have' ],
          },
          {
            simplified: '大',
            traditional: '大',
            pinyin: [ 'dà' ],
            english: [ 'large' ],
          },
          {
            simplified: '十',
            traditional: '十',
            pinyin: [ 'shí' ],
            english: [ 'ten' ],
          },
          {
            simplified: '人',
            traditional: '人',
            pinyin: [ 'rén' ],
            english: [ 'person' ],
          },
        ],
      },
      {
        type: ReviewItemType.Meaning,
        flashcard: {
          simplified: '人',
          traditional: '人',
          pinyin: [ 'rén' ],
          english: [ 'person' ],
        },
        level: 0,
      },
    ];
    this.initialized = true;
  }

  onStepChange(event: StepperSelectionEvent) {
    this.inputFormControl.reset();
    this.inputFormControl.setValue('');
    this.inputFormControl.setValidators([this.createValidator()]);
    this.inputFormControl.updateValueAndValidity();
  }

  createValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      switch (this.reviewItems[this.currentStepIndex]?.type) {
        case ReviewItemType.Pinyin:
          return this.validatePinyin(control);
        case ReviewItemType.Meaning:
          return this.validateMeaning(control);
        case ReviewItemType.Character:
          return this.validateCharacter(control);
        default:
          return null;
      }
    }
  }

  validatePinyin(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return {required: true};
    }
    const flashcard = this.reviewItems[this.currentStepIndex].flashcard;
    if (flashcard.pinyin.includes(value)) {
      return null;
    }
    const suggestions = flashcard.pinyin.filter(s => {
      return this.removeDiacritics(s) == this.removeDiacritics(value);
    });
    if (suggestions.length > 0) {
      return {
        partial: true,
        suggestions,
      };
    }
    return {wrong: true};
  }

  validateMeaning(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return {required: true};
    }
    const flashcard = this.reviewItems[this.currentStepIndex].flashcard;
    if (flashcard.english == value) {
      return null;
    }

    return {wrong: true};
  }

  validateCharacter(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return {required: true};
    }
    const flashcard = this.reviewItems[this.currentStepIndex].flashcard;
    if (flashcard.simplified == value) {
      return null;
    }
    return {wrong: true};
  }

  removeDiacritics(s: string) {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  onSubmit(event: SubmitEvent) {
    this.inputFormControl.markAsPristine();
    this.inputFormControl.setValidators([]);
  }
}

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && control.pristine);
  }
}