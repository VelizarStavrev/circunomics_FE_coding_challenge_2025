import { Component, inject, input, output } from '@angular/core';
import { IRepository } from '../repository-list.interface';
import { TimestampToTimeIntervalPipe } from '../../shared/pipes/timestamp-to-time-interval.pipe';
import { RatingComponent } from '../../shared/rating/rating.component';
import { RepositoryListService } from '../repository-list.service';

@Component({
  selector: 'app-repository-list-item',
  imports: [
    TimestampToTimeIntervalPipe,
    RatingComponent,
  ],
  templateUrl: './repository-list-item.component.html',
  styleUrl: './repository-list-item.component.scss',
})
export class RepositoryListItemComponent {
  private repositoryListService = inject(RepositoryListService);
  ratingMap = this.repositoryListService.ratings;
  
  /* istanbul ignore next */
  isRatingVisible = input.required<boolean>();
  /* istanbul ignore next */
  repository = input.required<IRepository>();
  repositoryNameClicked = output<void>();

  handleRepositoryNameClicked(): void {
    this.repositoryNameClicked.emit();
  }
}
