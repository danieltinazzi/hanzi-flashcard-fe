import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, FormArray, FormGroupDirective, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ReviewItemType } from '../../enums/review-item-type';
import {MatChipsModule} from '@angular/material/chips';
import { ReviewService } from '../../services/review/review.service';
import { Review } from '../../data/review';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { createValidator } from '../../functions/validation';
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

  review$: Observable<Review> | undefined;
  formGroup!: FormGroup;
  currentStepIndex: number = 0;

  customErrorStateMatcher = new CustomErrorStateMatcher();

  ReviewItemType = ReviewItemType;

  constructor(
    private reviewService: ReviewService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([])
    });
    this.review$ = this.reviewService.getReviewItems();
    this.reviewService.getReviewItems().subscribe((review: Review) => {
      review.reviewItems.forEach(reviewItem => {
        this.getFormArray().push(new FormControl('', [createValidator(reviewItem)]));
      });
    });
  }

  getFormArray() {
    console.log(this.formGroup.get('formArray') as FormArray);
    return this.formGroup.get('formArray') as FormArray;
  }

  getFormControl(index: number) {
    return this.getFormArray().get([index]) as FormControl;
  }

  onStepChange(event: StepperSelectionEvent) {/*
    const formControl = this.getFormControl(this.currentStepIndex);
    formControl.reset();
    formControl.setValue('');
    */
  }

  onSubmit() {
    const formControl = this.getFormControl(this.currentStepIndex);
    formControl.markAsPristine();
  }
}

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && control.pristine);
  }
}