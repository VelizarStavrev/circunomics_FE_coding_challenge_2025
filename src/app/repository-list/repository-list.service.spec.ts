import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RepositoryListService } from './repository-list.service';
import { provideHttpClient } from '@angular/common/http';

describe('RepositoryListService', () => {
  let service: RepositoryListService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    // Clear localStorage for each test
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RepositoryListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load ratings from localStorage on init', () => {
    const data = { 1: 5 };
    localStorage.setItem('repository_ratings', JSON.stringify(data));

    // Create a fresh instance inside DI context AFTER setting localStorage
    const newService = TestBed.runInInjectionContext(() => new RepositoryListService());

    expect(newService.getRating(1)).toBe(5);
  });

  it('should reset _ratings if localStorage data is corrupt', () => {
    localStorage.setItem('repository_ratings', 'not json');

    // Create a fresh instance inside DI context AFTER setting localStorage
    const newService = TestBed.runInInjectionContext(() => new RepositoryListService());

    expect(newService.getRating(12345)).toBeUndefined();
  });

  it('should set and get ratings', () => {
    service.setRating(10, 4);
    expect(service.getRating(10)).toBe(4);

    service.setRating(10, 5);
    expect(service.getRating(10)).toBe(5);
  });
});
