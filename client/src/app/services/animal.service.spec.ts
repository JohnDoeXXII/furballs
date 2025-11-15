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
  
  it('getAnimals() should GET /animals', () => {
    const mock: Animal[] = [{ name: 'A', id: '1', shelterId: '25-001', type: 'Dog', dateOfIntake: '2024-01-01' } as Animal];
    service.getAnimals().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne('/animals');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createAnimal() should POST /animals', () => {
    const payload: Animal = { name: 'X', id: '1', shelterId: '25-001', type: 'Dog', dateOfIntake: '2024-01-01' } as Animal;
    service.createAnimal(payload).subscribe(res => expect(res).toEqual(payload));

    const req = httpMock.expectOne('/animals');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('updateAnimal() should PUT with id query param', () => {
    const payload: Animal = { id: '5', name: 'X', shelterId: '25-001', type: 'Dog', dateOfIntake: '2024-01-01' } as Animal;
    service.updateAnimal(payload).subscribe(res => expect(res).toEqual(payload));

    const req = httpMock.expectOne('/animals/5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('getAnimalById() should GET with id query param', () => {
    const mock: Animal = { id: '9', name: 'F', shelterId: '25-001', type: 'Dog', dateOfIntake: '2024-01-01' } as Animal;
    service.getAnimalById('9').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne('/animals/9');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getAnimalCountByType() should GET /animals/count with type query param', () => {
    const type = 'Cat';
    const mockCount = 5;
    
    service.getAnimalCountByType(type).subscribe(res => expect(res).toEqual(mockCount));

    const req = httpMock.expectOne(request => 
      request.url === '/animals/count' && request.params.get('type') === type
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('type')).toBe(type);
    req.flush(mockCount);
  });

  it('getAnimalCountByType() should handle Dog type', () => {
    const type = 'Dog';
    const mockCount = 3;
    
    service.getAnimalCountByType(type).subscribe(res => expect(res).toEqual(mockCount));

    const req = httpMock.expectOne(request => 
      request.url === '/animals/count' && request.params.get('type') === type
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCount);
  });
});
