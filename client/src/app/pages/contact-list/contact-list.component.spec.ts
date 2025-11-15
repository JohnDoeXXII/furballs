import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../../services/contact.service';
import { of } from 'rxjs';
import { Contact } from '../../models/contact.model';
import { configureTestingModule } from '../../../test-resources/test-helpers';

describe('ContactListComponent', () => {
  let fixture: any;
  let component: ContactListComponent;
  let spyContactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    spyContactService = jasmine.createSpyObj('ContactService', ['getContacts']);
    spyContactService.getContacts.and.returnValue(of([{} as Contact]));

    await configureTestingModule({
      imports: [ContactListComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ContactService, useValue: spyContactService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
  });

  it('should call ContactService.getContacts on init', () => {
    component.ngOnInit();
    expect(spyContactService.getContacts).toHaveBeenCalled();
    expect(component.rowData.length).toBe(1);
  });
});
