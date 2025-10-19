import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { IntakeComponent } from './intake.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AnimalService } from '../services/animal.service';

describe('IntakeComponent', () => {
  let fixture: any;
  let component: IntakeComponent;
  let animalServiceSpy: jasmine.SpyObj<AnimalService>;

  beforeEach(async () => {
    animalServiceSpy = jasmine.createSpyObj('AnimalService', ['createAnimal']);
    await TestBed.configureTestingModule({
      imports: [IntakeComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(), 
        { provide: AnimalService, useValue: animalServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have required validators for name, animalType and dateOfIntake', () => {
    const form = component.animalIntake;
    expect(form.get('name')?.valid).toBeFalse();
    form.get('name')?.setValue('Bobby');
    expect(form.get('name')?.valid).toBeTrue();

    expect(form.get('animalType')?.valid).toBeTrue();
    form.get('animalType')?.setValue('');
    expect(form.get('animalType')?.valid).toBeFalse();

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
