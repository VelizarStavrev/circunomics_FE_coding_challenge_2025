import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryListModalComponent } from './repository-list-modal.component';
import { RepositoryListItemComponent } from '../repository-list-item/repository-list-item.component';
import { RepositoryListService } from '../repository-list.service';
import { RepositoryListServiceStub } from '../repository-list.service.stub';
import { RepositoryListItemComponentStub } from '../repository-list-item/repository-list-item.stub';
import { By } from '@angular/platform-browser';
import { Mock } from 'vitest';

describe('RepositoryListModalComponent', () => {
  let component: RepositoryListModalComponent;
  let fixture: ComponentFixture<RepositoryListModalComponent>;
  let service: RepositoryListServiceStub;

  const repository = {
    id: 'test_id',
    name: 'example-repo',
    owner: { login: 'jdoe', avatar_url: 'avatar.png' },
    description: 'An example repository.',
    stargazers_count: 100,
    open_issues_count: 50,
    created_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [RepositoryListModalComponent],
      providers: [
        { provide: RepositoryListService, useClass: RepositoryListServiceStub },
      ],
    })
      .overrideComponent(RepositoryListModalComponent, {
        remove: { imports: [RepositoryListItemComponent] },
        add: { imports: [RepositoryListItemComponentStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RepositoryListModalComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RepositoryListService) as unknown as RepositoryListServiceStub;

    fixture.componentRef.setInput('repository', repository);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TS Logic', () => {
    describe('ngOnInit', () => {
      it('should set repositoryRating from service if a rating exists', () => {
        component.ngOnInit();
        expect(component.repositoryRating).toBe(3);
      });

      it('should default repositoryRating to 0 if service returns undefined', () => {
        vi.spyOn(service, 'getRating').mockReturnValue(undefined);

        component.ngOnInit();
        expect(component.repositoryRating).toBe(0);
      });
    });

    describe('when closing', () => {
      let closeModalSpy: Mock;
      let saveSpy: Mock;

      beforeEach(() => {
        closeModalSpy = vi.spyOn(component.closeModal, 'emit');
        saveSpy = vi.spyOn(service, 'setRating');
      });

      describe('and rating is 0', () => {
        beforeEach(() => {
          component.repositoryRating = 0;
          component.handleCloseModal();
        });

        it('should NOT store the rating', () => {
          expect(saveSpy).not.toHaveBeenCalled();
        });

        it('should emit closeModal()', () => {
          expect(closeModalSpy).toHaveBeenCalled();
        });
      });

      describe('and rating is greater than 0', () => {
        beforeEach(() => {
          component.repositoryRating = 5;
          component.handleCloseModal();
        });

        it('should store the rating', () => {
          expect(saveSpy).toHaveBeenCalledWith('test_id', 5);
        });

        it('should emit closeModal()', () => {
          expect(closeModalSpy).toHaveBeenCalled();
        });
      });
    });
  });

  describe('HTML Rendering', () => {
    it('should render the modal container', () => {
      const container = fixture.debugElement.query(
        By.css('.container-repository-list-modal'),
      );
      expect(container).not.toBeNull();
    });

    it('should render RepositoryListItem with correct inputs', () => {
      const itemStub = fixture.debugElement.query(
        By.directive(RepositoryListItemComponentStub),
      );
      expect(itemStub).not.toBeNull();

      const repoInput = itemStub.componentInstance.repository();
      expect(repoInput.id).toBe('test_id');

      const isRatingVisible = itemStub.componentInstance.isRatingVisible();
      expect(isRatingVisible).toBe(false);
    });

    it('should bind rating value to app-rating component', () => {
      const ratingComp = fixture.debugElement.query(By.css('app-rating'));
      expect(ratingComp).not.toBeNull();

      expect(
        ratingComp.componentInstance.repositoryRating(),
      ).toBe(3);
    });

    describe('when the modal emits a close event', () => {
      let closeModalSpy: Mock;
      let saveSpy: Mock;

      beforeEach(() => {
        closeModalSpy = vi.spyOn(component.closeModal, 'emit');
        saveSpy = vi.spyOn(service, 'setRating');
        
        const modalElement = fixture.debugElement.query(By.css('app-modal'));
        modalElement.triggerEventHandler('closeModal', {});

        fixture.detectChanges();
      });
      
      it('should save the rating', () => {
        expect(saveSpy).toHaveBeenCalled();
      });

      it('should close the modal', () => {
        expect(closeModalSpy).toHaveBeenCalled();
      });
    });
  });
});
