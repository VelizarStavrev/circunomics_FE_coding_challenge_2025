import { Component, input } from '@angular/core';

@Component({
  selector: 'app-repository-list-modal',
  standalone: true,
  template: '',
})
export class RepositoryListModalComponentStub {
  // Required signal input
  repository = input.required();
}
