import { Component, input } from '@angular/core';

@Component({
  selector: 'app-repository-list-item',
  standalone: true,
  template: '',
})
export class RepositoryListItemComponentStub {
  // Required signal input
  repository = input.required();
  isRatingVisible = input.required();
}
