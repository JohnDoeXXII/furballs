import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EventDetailsComponent } from './event-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, from } from 'rxjs';

describe('EventDetailsComponent', () => {
  let fixture: any;
  let component: EventDetailsComponent;
  let eventServiceSpy: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    eventServiceSpy = jasmine.createSpyObj('EventService', ['create', 'getById', 'update']);
    eventServiceSpy.getById.and.returnValue(from(Promise.resolve({
      id: '1',
      name: 'Test Event',
      description: 'Test Description',
      startDatetime: '2025-01-01T10:00:00Z',
      endDatetime: '2025-01-01T12:00:00Z'
    })));

    await TestBed.configureTestingModule({
      imports: [EventDetailsComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: (_: any) => '1' }), snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('name field tests', () => {
    it('should exist', () => {
      expect(component.eventForm.get('name')).toBeTruthy();
    });

      it('should be required and invalid when empty', () => {
        const nameControl = component.eventForm.get('name');
        nameControl?.setValue('');
        expect(nameControl?.hasError('required')).toBeTrue();
      });
        
      it('should be valid when set with a value', () => {
        const nameControl = component.eventForm.get('name');
        nameControl?.setValue('Spring Fundraiser');
        expect(nameControl?.valid).toBeTrue();
      });
  });

  describe('description field tests', () => {
    it('should exist', () => {
      expect(component.eventForm.get('description')).toBeTruthy();
    });

      it('should be required and invalid when empty', () => {
        const descriptionControl = component.eventForm.get('description');
        descriptionControl?.setValue('');
        expect(descriptionControl?.hasError('required')).toBeTrue();
      });
        
      it('should be valid when set with a value', () => {
        const descriptionControl = component.eventForm.get('description');
        descriptionControl?.setValue('Annual fundraiser to support the animal shelter');
        expect(descriptionControl?.valid).toBeTrue();
      });
  });

  describe('startDatetime field tests', () => {
    it('should exist', () => {
      expect(component.eventForm.get('startDatetime')).toBeTruthy();
    });

      it('should be required and invalid when empty', () => {
        const startDatetimeControl = component.eventForm.get('startDatetime');
        startDatetimeControl?.setValue('');
        expect(startDatetimeControl?.hasError('required')).toBeTrue();
      });
        
      it('should be valid when set with a ISO 8601 datetime value', () => {
        const startDatetimeControl = component.eventForm.get('startDatetime');
        startDatetimeControl?.setValue('2025-06-15T14:00:00Z');
        expect(startDatetimeControl?.valid).toBeTrue();
      });
  });

  describe('endDatetime field tests', () => {
    it('should exist', () => {
      expect(component.eventForm.get('endDatetime')).toBeTruthy();
    });

      it('should be optional and valid when empty', () => {
        const endDatetimeControl = component.eventForm.get('endDatetime');
        endDatetimeControl?.setValue('');
        expect(endDatetimeControl?.valid).toBeTrue();
      });
        
      it('should be valid when set with a ISO 8601 datetime value', () => {
        const endDatetimeControl = component.eventForm.get('endDatetime');
        endDatetimeControl?.setValue('2025-06-15T18:00:00Z');
        expect(endDatetimeControl?.valid).toBeTrue();
      });
  });
});
