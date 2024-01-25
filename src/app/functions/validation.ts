import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ReviewItem } from "../data/review-item";
import { ReviewItemType } from "../enums/review-item-type";
import { removeDiacritics } from "./format";

export function createValidator(reviewItem: ReviewItem): ValidatorFn {
  switch (reviewItem.type) {
    case ReviewItemType.Pinyin:
      return createValidatorPinyin(reviewItem);
    case ReviewItemType.Meaning:
      return createValidatorMeaning(reviewItem);
    case ReviewItemType.Character:
      return createValidatorCharacter(reviewItem);
    default:
      return (control: AbstractControl) => {
        return null
      };
  }
}

function createValidatorPinyin(reviewItem: ReviewItem): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return {required: true};
    }
    const flashcard = reviewItem.flashcard;
    if (flashcard.pinyin.includes(value)) {
      return null;
    }
    const suggestions = flashcard.pinyin.filter(s => {
      return removeDiacritics(s) == removeDiacritics(value);
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

function createValidatorMeaning(reviewItem: ReviewItem): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return {required: true};
    }
    const flashcard = reviewItem.flashcard;
    if (flashcard.simplified == value) {
      return null;
    }
    return {wrong: true};
  }
}

function createValidatorCharacter(reviewItem: ReviewItem): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return {required: true};
    }
    const flashcard = reviewItem.flashcard;
    if (flashcard.simplified == value) {
      return null;
    }
    return {wrong: true};
  }
}