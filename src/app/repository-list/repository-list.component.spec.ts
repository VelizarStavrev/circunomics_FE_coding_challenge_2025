import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RepositoryListComponent } from './repository-list.component';
import { RepositoryListItemComponent } from './repository-list-item/repository-list-item.component';
import { RepositoryListItemComponentStub } from './repository-list-item/repository-list-item.stub';
import { RepositoryListModalComponent } from './repository-list-modal/repository-list-modal.component';
import { RepositoryListModalComponentStub } from './repository-list-modal/repository-list-modal.stub';
import { RepositoryListService } from './repository-list.service';
import { RepositoryListServiceStub } from './repository-list.service.stub';
import { Mock } from 'vitest';
import { IRepository } from './repository-list.interface';

describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;
  let service: RepositoryListServiceStub;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [RepositoryListComponent],
      providers: [
        { provide: RepositoryListService, useClass: RepositoryListServiceStub },
      ],
    })
      .overrideComponent(RepositoryListComponent, {
        remove: { 
          imports: [
            RepositoryListItemComponent,
            RepositoryListModalComponent,
          ],
        },
        add: {
          imports: [
            RepositoryListItemComponentStub,
            RepositoryListModalComponentStub,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RepositoryListService) as unknown as RepositoryListServiceStub;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TS logic', () => {
    let getRepositoriesSpy: Mock;

    describe('ngOnInit', () => {
      beforeEach(() => {
        getRepositoriesSpy = vi.spyOn(component, 'getRepositories');
        component.ngOnInit();
      });

      it('should call getRepositories on ngOnInit', () => {
        expect(getRepositoriesSpy).toHaveBeenCalled();
      });
    });

    it('should handle empty repository results', () => {
      vi.spyOn(service.repositoriesResource, 'value').mockReturnValue({
        total_count: 0,
        items: [],
        incomplete_results: false,
      });

      const newComp = TestBed.createComponent(RepositoryListComponent).componentInstance;
      newComp.ngOnInit();

      expect(newComp.repositories().length).toBe(0);
      expect(newComp.repositoriesTotal()).toBe(0);
    });

    it('should initialize repositories and total from service', () => {
      const result = service.repositoriesResource.value();
      expect(component.repositories().length).toBe(result.items.length);
      expect(component.repositoriesTotal()).toBe(result.total_count);
    });

    it('should open modal and set selectedRepository when repositoryClicked is called', () => {
      const repo = service.repositoriesResource.value().items[0];
      component.repositoryClicked(repo);

      expect(component.selectedRepository).toBe(repo);
      expect(component.isModalVisible()).toBe(true);
    });

    it('should close modal and clear selectedRepository when handleCloseModal is called', () => {
      const repo = service.repositoriesResource.value().items[0];
      component.repositoryClicked(repo);
      expect(component.isModalVisible()).toBe(true);

      component.handleCloseModal();

      expect(component.selectedRepository).toBeNull();
      expect(component.isModalVisible()).toBe(false);
    });

    it('should increment pageNumber and call getRepositories on scroll to bottom', () => {
      const getRepositoriesSpy = vi.spyOn(component, 'getRepositories');

      Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 0, configurable: true });

      const initialPage = component.pageNumber();
      component.onWindowScroll();

      expect(component.pageNumber()).toBe(initialPage + 1);
      expect(getRepositoriesSpy).toHaveBeenCalled();
    });

    it('should NOT increment pageNumber if scroll not at bottom', () => {
      const getRepositoriesSpy = vi.spyOn(component, 'getRepositories');

      Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true });

      const initialPage = component.pageNumber();
      component.onWindowScroll();

      expect(component.pageNumber()).toBe(initialPage);
      expect(getRepositoriesSpy).not.toHaveBeenCalled();
    });
  });

  describe('HTML rendering', () => {
    it('should render the correct number of RepositoryListItem components', () => {
      const items = fixture.debugElement.queryAll(By.css('app-repository-list-item'));
      const result = service.repositoriesResource.value();
      expect(items.length).toBe(result.items.length);
    });

    it('should display correct repository counts in the header', () => {
      const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
      const result = service.repositoriesResource.value();
      expect(h1.textContent).toContain(`${result.items.length} of ${result.total_count}`);
    });

    describe('when isModalVisible is true', () => {
      beforeEach(async() => {
        const repo = service.repositoriesResource.value().items[0];
        component.repositoryClicked(repo);
  
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it('should show the modal', () => {

        const modal = fixture.debugElement.query(By.css('app-repository-list-modal'));
        expect(modal).not.toBeNull();
      });
    });

    describe('when isModalVisible is false', () => {
      beforeEach(() => {
        component.handleCloseModal();
        fixture.detectChanges();
      });

      it('should hide the modal', () => {
        const modal = fixture.debugElement.query(By.css('app-repository-list-modal'));
        expect(modal).toBeNull();
      });
    });

    describe('when RepositoryListItem emits event', () => {
      let repositoryClickedSpy: Mock;
      let repository: IRepository;

      beforeEach(() => {
        repositoryClickedSpy = vi.spyOn(component, 'repositoryClicked');
        repository = service.repositoriesResource.value().items[0];
  
        const item = fixture.debugElement.queryAll(By.css('app-repository-list-item'))[0];
        item.triggerEventHandler('repositoryNameClicked', {});
      });

      it('should call repositoryClicked ', () => {
        expect(repositoryClickedSpy).toHaveBeenCalledWith(repository);
      });
    });
  });
});
