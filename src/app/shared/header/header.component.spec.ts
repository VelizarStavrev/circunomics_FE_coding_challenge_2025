import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct header text', () => {
    const headerElement: HTMLElement = fixture.nativeElement;
    const header = headerElement.querySelector('header')!;
    expect(header.textContent).toEqual('Circunomics Coding Challenge FE 2025');
  });
});
