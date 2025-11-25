import { Component, inject, input, OnInit, output } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import { RepositoryListItemComponent } from '../repository-list-item/repository-list-item.component';
import { IRepository } from '../repository-list.interface';
import { RatingComponent } from '../../shared/rating/rating.component';
import { RepositoryListService } from '../repository-list.service';

@Component({
  selector: 'app-repository-list-modal',
  imports: [
    ModalComponent,
    RepositoryListItemComponent,
    RatingComponent,
  ],
  templateUrl: './repository-list-modal.component.html',
  styleUrl: './repository-list-modal.component.scss',
})
export class RepositoryListModalComponent implements OnInit {
  private repositoryListService = inject(RepositoryListService);

  /* istanbul ignore next */
  repository = input.required<IRepository>();
  repositoryRating = 0; 
  closeModal = output<void>();

  ngOnInit(): void {
    this.repositoryRating = this.repositoryListService.getRating(this.repository().id) ?? 0;
  }

  handleCloseModal(): void {
    if (this.repositoryRating > 0) {
      this.repositoryListService.setRating(
        this.repository().id,
        this.repositoryRating,
      );
    }

    this.closeModal.emit();
  }
}
