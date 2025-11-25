import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingComponent } from './rating.component';
import { By } from '@angular/platform-browser';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;
  let highlightFn: (star: number) => boolean;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    highlightFn = component.isHighlighted();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have repositoryRating default to 0', () => {
    expect(component.repositoryRating()).toBe(0);
  });

  it('should have isStatic default to false', () => {
    expect(component.isStatic()).toBe(false);
  });

  describe('ngOnChanges', () => {
    describe('when repositoryRating > 0', () => {
      beforeEach(() => {
        component.repositoryRating.set(4);

        component.ngOnChanges({
          repositoryRating: {
            previousValue: 0,
            currentValue: 4,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        highlightFn = component.isHighlighted();
      });

      it('should set selected to the value', () => {
        expect(highlightFn(4)).toBe(true);
      });
    });

    describe('when repositoryRating = 0', () => {
      beforeEach(() => {
        component.repositoryRating.set(0);

        component.ngOnChanges({
          repositoryRating: {
            previousValue: 4,
            currentValue: 0,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        highlightFn = component.isHighlighted();
      });

      it('should NOT set selected', () => {
        expect(highlightFn(1)).toBe(false);
      });
    });
  });

  describe('onMouseEnter', () => {
    beforeEach(() => {
      component.onMouseEnter(3);
      highlightFn = component.isHighlighted();
    });

    it('should set hovered value', () => {
      expect(highlightFn(3)).toBe(true);
      expect(highlightFn(4)).toBe(false);
    });
  });

  describe('onMouseLeave', () => {
    beforeEach(() => {
      component.onMouseEnter(3);
      component.onMouseLeave();
      highlightFn = component.isHighlighted();
    });

    it('should clear hovered value', () => {
      expect(highlightFn(1)).toBe(false);
    });
  });

  describe('onClick', () => {
    beforeEach(() => {
      component.onClick(5);
      highlightFn = component.isHighlighted();
    });

    it('should set selected and repositoryRating', () => {
      expect(component.repositoryRating()).toBe(5);
      expect(highlightFn(5)).toBe(true);
    });
  });

  describe('HTML Rendering', () => {
    describe('when isStatic=true without event bindings', () => {
      let stars;

      beforeEach(async() => {
        fixture.componentRef.setInput('isStatic', true);
  
        fixture.detectChanges();
        await fixture.whenStable();
        stars = fixture.nativeElement.querySelectorAll('app-star-svg');
        highlightFn = component.isHighlighted();
      });

      it('should render 5 stars', () => {
        expect(stars.length).toBe(5);
      });

      it('should render static view', () => {
        expect(highlightFn(1)).toBe(false);
      });
    });

    describe('when isStatic=false with event bindings', () => {
      let stars;

      beforeEach(async() => {
        fixture.componentRef.setInput('isStatic', false);
  
        fixture.detectChanges();
        await fixture.whenStable();
        stars = fixture.nativeElement.querySelectorAll('app-star-svg');
      });

      it('should render 5 stars', () => {
        expect(stars.length).toBe(5);
      });

      describe('and a star is hovered', () => {
        beforeEach(() => {
          component.onMouseEnter(2);
          fixture.detectChanges();
          highlightFn = component.isHighlighted();
        });
        
        it('should render interactive view', () => {
          expect(highlightFn(2)).toBe(true);
          expect(highlightFn(3)).toBe(false);
        });
      });
    });

    describe('when stars are hovered', () => {
      beforeEach(async() => {
        fixture.componentRef.setInput('isStatic', false);
        fixture.detectChanges();
        await fixture.whenStable();
  
        const stars = fixture.debugElement.queryAll(By.css('app-star-svg'));
        stars[2].triggerEventHandler('mouseenter', {});
        fixture.detectChanges();

        highlightFn = component.isHighlighted();
      });

      it('should highlight stars on mouseenter (hover)', () => {
        expect(highlightFn(1)).toBe(true);
        expect(highlightFn(2)).toBe(true);
        expect(highlightFn(3)).toBe(true);
        expect(highlightFn(4)).toBe(false);
        expect(highlightFn(5)).toBe(false);
      });
    });

    describe('when stars are unhovered', () => {
      beforeEach(async() => {
        fixture.componentRef.setInput('isStatic', false);
        fixture.detectChanges();
        await fixture.whenStable();
  
        const stars = fixture.debugElement.queryAll(By.css('app-star-svg'));
  
        // Hover first to set a value
        stars[3].triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
  
        // Now mouseleave
        stars[3].triggerEventHandler('mouseleave', {});
        fixture.detectChanges();

        highlightFn = component.isHighlighted();
      });

      it('should clear hover when mouse leaves', () => {
        expect(highlightFn(1)).toBe(false);
        expect(highlightFn(5)).toBe(false);
      });
    });

    describe('when a star is clicked', () => {
      beforeEach(async() => {
        fixture.componentRef.setInput('isStatic', false);
        fixture.detectChanges();
        await fixture.whenStable();
  
        const stars = fixture.debugElement.queryAll(By.css('app-star-svg'));
  
        // Click the 4th star (index 3)
        stars[3].triggerEventHandler('click', {});
        fixture.detectChanges();

        highlightFn = component.isHighlighted();
      });

      it('should have a repositoryRating of 4', () => {
        expect(component.repositoryRating()).toBe(4);
      });

      it('should have stars up to 4 highlighted', () => {
        expect(highlightFn(1)).toBe(true);
        expect(highlightFn(4)).toBe(true);
        expect(highlightFn(5)).toBe(false);
      });
    });
  });
});
