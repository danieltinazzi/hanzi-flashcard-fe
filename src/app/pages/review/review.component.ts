import { Component } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { Character } from '../../data/character';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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

  characters: Character[] = [];
  initialized: boolean = false;
  inputFormControl = new FormControl('', [Validators.required]);

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
}
