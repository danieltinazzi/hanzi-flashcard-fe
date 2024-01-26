import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, FormArray, FormGroupDirective, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { ReviewItemType } from '../../enums/review-item-type';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewService } from '../../services/review/review.service';
import { Review } from '../../data/review';
import { CommonModule } from '@angular/common';
import { createValidator } from '../../functions/validation';
import { ReviewItemStatus } from '../../enums/review-item-status';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
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
  
  @ViewChild('stepper') stepper!: MatStepper;
  customErrorStateMatcher = new CustomErrorStateMatcher();

  review!: Review;
  formGroup!: FormGroup;
  currentStepIndex: number = 0;
  isCurrentStepSubmitted: boolean = false;

  ReviewItemType = ReviewItemType;
  ReviewItemStatus = ReviewItemStatus;

  constructor(
    private reviewService: ReviewService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([])
    });
    this.reviewService.getReviewItems().subscribe((review: Review) => {
      this.review = review;
      this.createValidators();
    });
  }

  createValidators() {
    this.review.reviewItems.forEach(reviewItem => {
      this.getFormArray().push(new FormControl('', [createValidator(reviewItem)]));
    });
  }

  getFormArray() {
    return this.formGroup.get('formArray') as FormArray;
  }

  getFormControl(index: number) {
    return this.getFormArray().get([index]) as FormControl;
  }

  onSubmit() {
    console.log('submit');
    const formControl = this.getFormControl(this.currentStepIndex);
    const reviewItem = this.review.reviewItems[this.currentStepIndex];

    if (reviewItem.status != ReviewItemStatus.Pending) {
      formControl.clearValidators();
      formControl.updateValueAndValidity();
      this.stepper.next();
      return;
    }
    reviewItem.status = formControl.getError('status');
    formControl.markAsPristine();
  }
}

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(formControl: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(formControl && formControl.invalid && formControl.pristine
      && formControl.getError('status') != ReviewItemStatus.Pending);
  }
}