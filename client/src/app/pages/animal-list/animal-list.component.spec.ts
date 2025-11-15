import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AnimalListComponent } from './animal-list.component';
import { Animal, AnimalService } from '../../services/animal.service';
import { of } from 'rxjs';
import { configureTestingModule } from '../../../test-resources/test-helpers';

describe('AnimalListComponent', () => {
  let fixture: any;
  let component: AnimalListComponent;
  let spyAnimalService: jasmine.SpyObj<AnimalService>;
  
  beforeEach(async () => {
    spyAnimalService = jasmine.createSpyObj('AnimalService', ['getAnimals']);
    spyAnimalService.getAnimals.and.returnValue(of([{ } as Animal]));
    await configureTestingModule({
      imports: [AnimalListComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AnimalService, useValue: spyAnimalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalListComponent);
    component = fixture.componentInstance;
  });

  it('should call AnimalService.getAnimals on init', () => {
    component.ngOnInit();
    expect(spyAnimalService.getAnimals).toHaveBeenCalled();
    expect(component.rowData.length).toBe(1);
  });
});
