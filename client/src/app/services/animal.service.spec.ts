import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AnimalService, Animal } from './animal.service';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';

describe('AnimalService', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;
  let mockAnimal: Animal = {} as Animal;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        AnimalService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ],
    });

    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAnimals() should request list from API', () => {
    const mock: Animal[] = [
      {  } as Animal
    ];

    service.getAnimals().subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne('/animals');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createAnimal() should POST to API and return created animal', () => {

    service.createAnimal(mockAnimal).subscribe((res) => {
      expect(res).toEqual(mockAnimal);
    });

    const req = httpMock.expectOne('/animals');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAnimal);
    req.flush(mockAnimal);
  });
});
