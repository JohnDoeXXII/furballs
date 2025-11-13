import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';
import { catchError, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-details.component.html'
})
export class EventDetailsComponent implements OnInit {

  @Input("readMode")
  readMode: boolean = false;

  @Input("eventId")
  public eventId: string | null = null;

  eventForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startDatetime: new FormControl('', [Validators.required]),
    endDatetime: new FormControl('')
  });

  event$: Observable<Event> | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
      if (this.eventId) {
        this.loadEvent();
      }
    });
  }

  private loadEvent() {
    if (!this.eventId) return;

    this.loading = true;
    this.event$ = this.eventService.getById(this.eventId).pipe(
      map(event => {
        this.eventForm.patchValue({
          name: event.name,
          description: event.description,
          startDatetime: event.startDatetime,
          endDatetime: event.endDatetime || ''
        });
        this.loading = false;
        return event;
      }),
      catchError(err => {
        this.error = 'Failed to load event';
        this.loading = false;
        throw err;
      })
    );
  }

  saveEvent() {
    if (this.eventForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    const formValue = this.eventForm.value;
    const event: Event = {
      id: this.eventId || '',
      name: formValue.name,
      description: formValue.description,
      startDatetime: formValue.startDatetime,
      endDatetime: formValue.endDatetime || undefined
    };

    if (this.eventId) {
      this.eventService.update(this.eventId, event).subscribe(
        () => {
          this.router.navigate(['/events']);
        },
        err => {
          this.error = 'Failed to update event';
        }
      );
    } else {
      this.eventService.create(event).subscribe(
        () => {
          this.router.navigate(['/events']);
        },
        err => {
          this.error = 'Failed to create event';
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/events']);
  }
}
