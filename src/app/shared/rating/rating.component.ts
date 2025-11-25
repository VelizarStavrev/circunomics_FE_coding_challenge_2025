import { Component, computed, input, model, OnChanges, signal, SimpleChanges } from '@angular/core';
import { StarSVGComponent } from './star.component';

@Component({
  selector: 'app-rating',
  imports: [
    StarSVGComponent,
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent implements OnChanges {
  /* istanbul ignore next */
  repositoryRating = model<number>(0);
  /* istanbul ignore next */
  isStatic = input<boolean>(false);
  readonly stars = [1, 2, 3, 4, 5];

  /* istanbul ignore next */
  private hovered = signal<number | null>(null);
  /* istanbul ignore next */
  private selected = signal<number>(0);

  /* istanbul ignore next */
  isHighlighted = computed(() => {
    const threshold = this.hovered() ?? this.selected();
    return (star: number) => star <= threshold;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['repositoryRating']) {
      const repositoryRating = this.repositoryRating();

      if (repositoryRating > 0) {
        this.selected.set(repositoryRating);
      }
    }
  }

  onMouseEnter(star: number) {
    this.hovered.set(star);
  }

  onMouseLeave() {
    this.hovered.set(null);
  }

  onClick(star: number) {
    this.selected.set(star);
    this.repositoryRating.set(star);
  }
}
