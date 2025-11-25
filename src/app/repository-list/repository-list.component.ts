import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RepositoryListItemComponent } from './repository-list-item/repository-list-item.component';
import { RepositoryListService } from './repository-list.service';
import { IRepository } from './repository-list.interface';
import { RepositoryListModalComponent } from './repository-list-modal/repository-list-modal.component';

@Component({
  standalone: true,
  selector: 'app-repository-list',
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
  imports: [
    RepositoryListItemComponent,
    RepositoryListModalComponent,
  ],
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss',
})
export class RepositoryListComponent implements OnInit {
  private repositoryListService = inject(RepositoryListService);

  /* istanbul ignore next */
  pageNumber = signal(1);
  /* istanbul ignore next */
  repositories = signal<IRepository[]>([]);
  /* istanbul ignore next */
  repositoriesTotal = signal(0);
  
  /* istanbul ignore next */
  isModalVisible = signal(false);
  selectedRepository: IRepository | null = null;

  constructor() {
    effect(() => {
      const result = this.repositoryListService.repositoriesResource.value();

      if (result?.total_count) {
        this.repositoriesTotal.set(result.total_count);
      }

      if (result?.items) {
        this.repositories.update((current) => [...current, ...result.items]);
      }
    });
  }

  ngOnInit(): void {
    this.getRepositories();
  }

  getRepositories(): void {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const dateFormatted = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    this.repositoryListService.setParams(dateFormatted, this.pageNumber());
  }

  repositoryClicked(repository: IRepository): void {
    this.selectedRepository = repository;
    this.isModalVisible.set(true);
  }

  handleCloseModal(): void {
    this.selectedRepository = null;
    this.isModalVisible.set(false);
  }

  onWindowScroll(): void {
    const currentScrollPosition = document.documentElement.scrollTop + document.documentElement.clientHeight;
    const maximumScrollPosition = document.documentElement.scrollHeight;

    if (currentScrollPosition >= maximumScrollPosition) {
      this.pageNumber.update((value) => value + 1);
      this.getRepositories();
    }
  }
}
