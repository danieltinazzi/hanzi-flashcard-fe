import { ReviewItemType } from "../enums/review-item-type";
import { Flashcard } from "./flashcard";

export interface ReviewItem {
    type: ReviewItemType;
    flashcard: Flashcard;
    level: number;
    options?: Flashcard[];
}