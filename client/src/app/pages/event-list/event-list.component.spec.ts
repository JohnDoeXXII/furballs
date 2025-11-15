import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EventListComponent } from './event-list.component';
import { Event, EventService } from '../../services/event.service';
import { of } from 'rxjs';
import { configureTestingModule } from '../../../test-resources/test-helpers';

describe('EventListComponent', () => {
  let fixture: any;
  let component: EventListComponent;
  let spyEventService: jasmine.SpyObj<EventService>;
  
  beforeEach(async () => {
    spyEventService = jasmine.createSpyObj('EventService', ['getAll']);
    spyEventService.getAll.and.returnValue(of([{ } as Event]));
    await configureTestingModule({
      imports: [EventListComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EventService, useValue: spyEventService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
  });

  it('should call EventService.getAll on init', () => {
    component.ngOnInit();
    expect(spyEventService.getAll).toHaveBeenCalled();
    expect(component.rowData.length).toBe(1);
  });
});
