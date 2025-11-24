import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// Create a dummy component for ng-content testing
@Component({
  selector: 'app-dummy-content',
  template: '<p>Dummy Content</p>',
  standalone: true,
})
class DummyContentComponent {}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent, DummyContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when handleCloseModal is called', () => {
    beforeEach(() => {
      vi.spyOn(component.closeModal, 'emit');
      component.handleCloseModal();
    });

    it('should emit closeModal event', () => {
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('when the close container is clicked', () => {
    beforeEach(() => {
      vi.spyOn(component, 'handleCloseModal');
      const closeContainer = fixture.debugElement.query(By.css('.container-close'));
      closeContainer.triggerEventHandler('click');
    });

    it('should call handleCloseModal', () => {
      expect(component.handleCloseModal).toHaveBeenCalled();
    });
  });

  describe('when a component is passed for projection', () => {
    @Component({
      template: `
        <app-modal>
          <app-dummy-content></app-dummy-content>
        </app-modal>
      `,
      imports: [ModalComponent, DummyContentComponent],
      standalone: true,
    })
    class TestHostComponent {}
    
    let hostFixture: ComponentFixture<TestHostComponent>;
    let dummyContentElement: DebugElement;
  
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      dummyContentElement = hostFixture.debugElement.query(By.directive(DummyContentComponent));
    });

    it('should project content using ng-content', () => {
      expect(dummyContentElement).toBeTruthy();
    });
  });
});
