import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Animal, AnimalService } from '../services/animal.service';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ANIMAL_LIST_ROUTE } from '../app.routes';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-details.component.html'
})
export class AnimalDetailsComponent implements OnInit{

  @Input("readMode")
  readMode: boolean = false;

  @Input("animalId")
  public animalId: string | null = null;

  animalIntake: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    shelterId: new FormControl('25-001'),
    type: new FormControl('Dog', [Validators.required]),
    dateOfIntake: new FormControl(new Date().toISOString().slice(0, 10), [Validators.required]),
    dateOfBirth: new FormControl(
      new Date((new Date()).getUTCFullYear() - 4, 0, 1).toISOString().slice(0, 10), []),
    notes: new FormControl('', [Validators.maxLength(250)])
  });

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.animalId) {
      this.animalId = this.route.snapshot.paramMap.get('animalId');
      this.animalService.getMaxShelterId()
        .subscribe((maxId: string) => {
          this.animalIntake.controls['shelterId'].setValue(maxId);
        });
    }

    if (this.animalId) {
      this.animalService.getAnimalById(this.animalId)
        .subscribe( animal => {
          this.animalIntake.patchValue(animal);
        });
    }
  }

  onSubmit() {
    return this.getAnimalSubmission()
            .pipe(
                map((createdAnimal) => {
                    // eslint-disable-next-line no-console
                    console.log('Created animal:', createdAnimal);
                    this.router.navigate(['/' + ANIMAL_LIST_ROUTE.path]);
                }),
                catchError((error, _stack) => {
                    throw error;
                })
            )
            .subscribe();
            
  }

  private getAnimalSubmission(): Observable<Animal> {
    if (this.animalId) {
      return this.animalService.updateAnimal({
        ...this.animalIntake.value as Animal,
        id: this.animalId
      });
    } else {
      return this.animalService.createAnimal(this.animalIntake.value as Animal);
    }
  }
}
