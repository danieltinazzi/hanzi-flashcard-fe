import { Injectable } from '@angular/core';
import { ReviewItemType } from '../../enums/review-item-type';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ReviewItem } from '../../data/review-item';
import { Review } from '../../data/review';
import { ReviewItemStatus } from '../../enums/review-item-status';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  review = {
    reviewItems: [
      {
        type: ReviewItemType.Meaning,
        flashcard: {
          simplified: '人',
          traditional: '人',
          pinyin: [ 'rén' ],
          english: [ 'person' ],
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
        status: ReviewItemStatus.Pending,
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
        status: ReviewItemStatus.Pending,
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
        status: ReviewItemStatus.Pending,
      },
    ]
  };

  constructor(private http: HttpClient) { }

  getReviewItems(): Observable<Review> {
    // return this.http.get<Review>(`/api/review`);
    return of(this.review);
  }
}
