import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Animal, AnimalService } from '../services/animal.service';
import { catchError, map } from 'rxjs';

@Component({
  selector: 'app-intake',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './intake.component.html'
})
export class IntakeComponent {
  animalIntake: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    shelterId: new FormControl('25-001'),
    type: new FormControl('Dog', [Validators.required]),
    dateOfIntake: new FormControl(new Date().toISOString().slice(0, 10), [Validators.required]),
    dateOfBirth: new FormControl(''),
    notes: new FormControl('', [Validators.maxLength(250)])
  });

  constructor(private animalService: AnimalService) {}

  onSubmit() {
    return this.animalService
        .createAnimal(this.animalIntake.value as Animal)
            .pipe(
                map((createdAnimal) => {
                    // eslint-disable-next-line no-console
                    console.log('Created animal:', createdAnimal);
                }),
                catchError((error, stack) => {
                    throw error;
                })
            )
            .subscribe();
            
  }
}
