import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { InventoryComponent } from './inventory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnimalService } from '../services/animal.service';
import { of } from 'rxjs';

describe('InventoryComponent', () => {
  let fixture: any;
  let component: InventoryComponent;
  let svc: AnimalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryComponent, HttpClientTestingModule],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    svc = TestBed.inject(AnimalService);
  });

  it('should call AnimalService.getAnimals on init', () => {
    const spy = spyOn(svc, 'getAnimals').and.returnValue(of([{ id: '', shelterId: 'x', name: 'a', animalType: 'Cat', dateOfIntake: '2025-10-13' }]));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    component.animals$.subscribe(list => {
      expect(list.length).toBe(1);
    });
  });
});
