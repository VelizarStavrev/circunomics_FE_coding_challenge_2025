import { signal } from '@angular/core';
import { IRepositories, IRepository } from './repository-list.interface';
import { vi } from 'vitest';

export class RepositoryListServiceStub {
  // Instead of httpResource, we just expose a signal with fake data
  private _result = signal<IRepositories>({
    total_count: 2,
    incomplete_results: false,
    items: [
      { id: 1, name: 'Repo One' } as IRepository,
      { id: 2, name: 'Repo Two' } as IRepository,
    ],
  });

  repositoriesResource = {
    value: this._result,
    reload: vi.fn(),
  };

  repositories = this._result;

  setParams = vi.fn();

  ratings = signal<Record<string, number>>({
    test_id: 4,
  });

  private ratingStore: Record<string, number> = {
    test_id: 3,
  };

  getRating(id: string): number | undefined {
    return this.ratingStore[id];
  }

  setRating(id: string, value: number) {
    this.ratingStore[id] = value;
  }
}
