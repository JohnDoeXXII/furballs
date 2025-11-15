import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Animal, AnimalService } from '../../services/animal.service';
import { catchError, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ANIMAL_LIST_ROUTE } from '../../app.routes';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule],
  templateUrl: './animal-details.component.html'
})
export class AnimalDetailsComponent implements OnInit {

  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'Neutering', date: new Date().toISOString().slice(0, 10) },
      { 
        title: 'Neuter Heal', 
        start: new Date(new Date().getTime() + 86400000).toISOString().slice(0, 10), 
        end: new Date(new Date().getTime() + 86400000 * 5).toISOString().slice(0, 10)
      }
    ]
  };

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
    }

    if (this.animalId) {
      this.animalService.getAnimalById(this.animalId)
        .subscribe( animal => {
          this.animalIntake.patchValue(animal);
        });
    } else {
      
      this.animalService.getMaxShelterId()
        .subscribe((maxId: string) => {
          this.animalIntake.controls['shelterId'].setValue(maxId);
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

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
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
