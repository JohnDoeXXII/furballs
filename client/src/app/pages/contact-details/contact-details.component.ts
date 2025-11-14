import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import { CONTACT_LIST_ROUTE } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetails implements OnInit {

  @Input("readMode")
  readMode: boolean = false;

  @Input("contactId")
  public contactId: string | null = null;

  contactIntake: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    email: new FormControl('', [Validators.email]),
  });

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.contactId) {
      this.contactId = this.route.snapshot.paramMap.get('contactId');
    }

    if (this.contactId) {
      this.contactService.getContactById(this.contactId)
        .subscribe(contact => {
          this.contactIntake.patchValue(contact);
        });
    }
  }

  onSubmit() {
    return this.getContactSubmission()
            .pipe(
                map((createdContact) => {
                    // eslint-disable-next-line no-console
                    console.log('Created contact:', createdContact);
                    this.router.navigate(['/' + CONTACT_LIST_ROUTE.path]);
                }),
                catchError((error, _stack) => {
                    throw error;
                })
            )
            .subscribe();
            
  }

  private getContactSubmission(): Observable<Contact> {
    if (this.contactId) {
      return this.contactService.updateContact({
        ...this.contactIntake.value as Contact,
        id: this.contactId
      });
    } else {
      return this.contactService.createContact(this.contactIntake.value);
    }
  }
}
