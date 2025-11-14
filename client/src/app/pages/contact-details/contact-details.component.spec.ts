import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ContactDetails } from './contact-details.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from "../../models/contact.model";
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ContactDetails', () => {
  let fixture: any;
  let component: ContactDetails;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    contactServiceSpy = jasmine.createSpyObj('ContactService', ['getContactById', 'createContact', 'updateContact']);
    contactServiceSpy.getContactById.and.returnValue(of({ id: '1', firstName: 'A', lastName: 'B' } as Contact));

    await TestBed.configureTestingModule({
      imports: [ContactDetails],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ContactService, useValue: contactServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['contactId','1']]) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
