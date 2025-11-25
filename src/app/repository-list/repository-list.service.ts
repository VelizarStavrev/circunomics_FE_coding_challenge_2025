import { httpResource } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { IRepositories } from './repository-list.interface';

@Injectable({
  providedIn: 'root',
})
export class RepositoryListService {
  /* istanbul ignore next */
  private readonly _ratings = signal<Record<number, number | undefined>>({});
  readonly ratings = this._ratings.asReadonly();
  private readonly STORAGE_KEY = 'repository_ratings';

  /* istanbul ignore next */
  private date = signal('');
  /* istanbul ignore next */
  private page = signal(1);
  private readonly sort = 'stars';
  private readonly perPage = 10;

  constructor() {
    this.loadFromLocalStorage();

    effect(() => {
      const value = this._ratings();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
    });
  }

  // A reactive resource bound to signals:
  repositoriesResource = httpResource<IRepositories>(() => ({
    url: `https://api.github.com/search/repositories?q=created:>${this.date()}&sort=${this.sort}&per_page=${this.perPage}&page=${this.page()}`,
  }));

  repositories = this.repositoriesResource.value;

  setParams(date: string, page: number) {
    this.date.set(date);
    this.page.set(page);
    this.repositoriesResource.reload();
  }

  setRating(repositoryId: number, rating: number): void {
    this._ratings.update((currentRatings) => ({
      ...currentRatings,
      [repositoryId]: rating,
    }));
  }

  getRating(repositoryId: number): number | undefined {
    return this._ratings()[repositoryId];
  }

  private loadFromLocalStorage(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
  
    if (raw) {
      try {
        this._ratings.set(JSON.parse(raw));
      } catch {
        // Corrupt data? Reset.
        this._ratings.set({});
      }
    }
  }
}
