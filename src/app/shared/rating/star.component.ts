import { Component, input } from '@angular/core';

@Component({
  selector: 'app-star-svg',
  imports: [],
  templateUrl: './star.component.svg',
  styles: [
    ':host { display: inline-flex; cursor: pointer; }',
    'svg { height: 25px; width: auto; }',
  ],
})
export class StarSVGComponent {
  /* istanbul ignore next */
  isHighlighted = input(false);
  normalfillColor = '#D9D9D9';
  highlightedfillColor = '#fced1d';
}
