import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AnimalDetailsComponent } from './animal-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AnimalService } from '../../services/animal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('AnimalDetalsComponent', () => {
  let fixture: any;
  let component: AnimalDetailsComponent;
  let animalServiceSpy: jasmine.SpyObj<AnimalService>;

  beforeEach(async () => {
    animalServiceSpy = jasmine.createSpyObj('AnimalService', ['createAnimal', 'getAnimalById', 'getMaxShelterId']);
    animalServiceSpy.getMaxShelterId.and.returnValue(of('20-100'));
    await TestBed.configureTestingModule({
      imports: [AnimalDetailsComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(), 
        { provide: AnimalService, useValue: animalServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have required validators for name, type and dateOfIntake', () => {
    const form = component.animalIntake;
    expect(form.get('name')?.valid).toBeFalse();
    form.get('name')?.setValue('Bobby');
    expect(form.get('name')?.valid).toBeTrue();

    expect(form.get('type')?.valid).toBeTrue();
    form.get('type')?.setValue('');
    expect(form.get('type')?.valid).toBeFalse();

    expect(form.get('dateOfIntake')?.valid).toBeTrue();
    form.get('dateOfIntake')?.setValue('');
    expect(form.get('dateOfIntake')?.valid).toBeFalse();
  });

  it('should enforce maxlength 250 on notes', () => {
    const notes = component.animalIntake.get('notes');
    const longText = 'x'.repeat(260);
    notes?.setValue(longText);
    expect(notes?.hasError('maxlength')).toBeTrue();
  });
});
