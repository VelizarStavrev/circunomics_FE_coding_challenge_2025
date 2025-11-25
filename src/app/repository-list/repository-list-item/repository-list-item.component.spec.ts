import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryListItemComponent } from './repository-list-item.component';
import { RepositoryListService } from '../repository-list.service';
import { RepositoryListServiceStub } from '../repository-list.service.stub';
import { By } from '@angular/platform-browser';
import { Mock } from 'vitest';

describe('RepositoryListItemComponent', () => {
  let component: RepositoryListItemComponent;
  let fixture: ComponentFixture<RepositoryListItemComponent>;

  const repository = {
    owner: {
      avatar_url: 'test_avatar_url',
      login: 'test_login',
    },
    id: 'test_id',
    name: 'test_name',
    description: 'test_description',
    stargazers_count: 123,
    open_issues_count: 456,
    created_at: '2025-11-24T19:48:55Z',
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [RepositoryListItemComponent],
      providers: [
        { provide: RepositoryListService, useClass: RepositoryListServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RepositoryListItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('repository', repository);
    fixture.componentRef.setInput('isRatingVisible', true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TS Logic', () => {
    describe('when handleRepositoryNameClicked is called', () => {
      let repositoryNameClickedSpy: Mock;

      beforeEach(() => {
        repositoryNameClickedSpy = vi.spyOn(component.repositoryNameClicked, 'emit');
        component.handleRepositoryNameClicked();
      });

      it('should emit event', () => {
        expect(repositoryNameClickedSpy).toHaveBeenCalled();
      });
    });
  });

  describe('HTML Rendering', () => {
    it('should display avatar image correctly', () => {
      const img: HTMLImageElement = fixture.debugElement.query(
        By.css('img.avatar'),
      ).nativeElement;

      expect(img.src).toContain(repository.owner.avatar_url);
      expect(img.alt).toContain(repository.owner.login);
    });

    it('should display name, description, stars and issues', () => {
      const native = fixture.nativeElement;

      expect(native.querySelector('.title').textContent).toContain(repository.name);
      expect(native.querySelector('.description').textContent).toContain(repository.description);
      expect(native.querySelector('.stars').textContent).toContain(repository.stargazers_count);
      expect(native.querySelector('.issues').textContent).toContain(repository.open_issues_count);
    });

    describe('Rating component', () => {
      it('should render the rating component when isRatingVisible=true', () => {
        const ratingComp = fixture.debugElement.query(By.css('app-rating'));
        expect(ratingComp).not.toBeNull();
      });
  
      it('should pass the rating value from ratings map to the RatingComponent', () => {
        const ratingComp = fixture.debugElement.query(By.css('app-rating'));
  
        const repoRatingValue = ratingComp.componentInstance.repositoryRating();
  
        // From the stub service: test_id = 4
        expect(repoRatingValue).toBe(4);
      });
  
      it('should NOT show the rating component if isRatingVisible=false', async() => {
        fixture.componentRef.setInput('isRatingVisible', false);
  
        fixture.detectChanges();
        await fixture.whenStable();
  
        const ratingComp = fixture.debugElement.query(By.css('app-rating'));
  
        expect(ratingComp).toBeNull();
      });
    });

    describe('when repository title container is clicked', () => {
      let repositoryNameClickedSpy: Mock;

      beforeEach(() => {
        repositoryNameClickedSpy = vi.spyOn(component.repositoryNameClicked, 'emit');
        
        const clickable = fixture.debugElement.query(
          By.css('.container-title-and-rating'),
        );
  
        clickable.triggerEventHandler('click', {});
        fixture.detectChanges();
      });

      it('should fire click event', () => {  
        expect(repositoryNameClickedSpy).toHaveBeenCalled();
      });
    });
  });
});
