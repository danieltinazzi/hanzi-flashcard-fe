import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ReviewItem } from "../data/review-item";
import { ReviewItemType } from "../enums/review-item-type";
import { removeDiacritics } from "./format";
import { ReviewItemStatus } from "../enums/review-item-status";

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
    if (reviewItem.status != ReviewItemStatus.Pending) {
      return null;
    }
    const value = control.value;
    if (!value) {
      return {
        status: ReviewItemStatus.Pending,
      };
    }
    const flashcard = reviewItem.flashcard;
    if (flashcard.pinyin.includes(value)) {
      return {
        status: ReviewItemStatus.Correct,
      };
    }
    const suggestions = flashcard.pinyin.filter(s => {
      return removeDiacritics(s) == removeDiacritics(value);
    });
    if (suggestions.length > 0) {
      return {
        status: ReviewItemStatus.PartiallyCorrect,
        suggestions,
      };
    }
    return {
      status: ReviewItemStatus.Wrong,
      suggestions: reviewItem.flashcard.pinyin,
    };
  }
}

function createValidatorMeaning(reviewItem: ReviewItem): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (reviewItem.status != ReviewItemStatus.Pending) {
      return null;
    }
    const value = control.value;
    if (!value) {
      return {
        status: ReviewItemStatus.Pending,
      };
    }
    const flashcard = reviewItem.flashcard;
    if (flashcard.simplified == value) {
      return {
        status: ReviewItemStatus.Correct,
      };
    }
    return {
      status: ReviewItemStatus.Wrong,
      suggestions: reviewItem.flashcard.english,
    };
  }
}

function createValidatorCharacter(reviewItem: ReviewItem): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (reviewItem.status != ReviewItemStatus.Pending) {
      return null;
    }
    const value = control.value;
    if (!value) {
      return {
        status: ReviewItemStatus.Pending,
      };
    }
    const flashcard = reviewItem.flashcard;
    if (flashcard.simplified == value) {
      return {
        status: ReviewItemStatus.Correct,
      };
    }
    return {
      status: ReviewItemStatus.Wrong,
      suggestions: reviewItem.flashcard.simplified,
    };
  }
}