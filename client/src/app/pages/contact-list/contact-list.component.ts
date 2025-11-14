import { ChangeDetectorRef, Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { AgPersist } from '../../services/ag-persist.mixin';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from "ag-grid-angular";
import { Link } from "../../components/link/link.component";
import { LinkRendererComponent } from '../../components/link/link-renderer.component';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list.component',
  imports: [AgGridModule, Link],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {

  constructor(private contactService: ContactService, private cd: ChangeDetectorRef) {}

  // AG Grid column definitions and row data
  columnDefs: ColDef[] = [
    { field: 'lastName', headerName: 'Last', sortable: true, filter: true },
    { field: 'firstName', headerName: 'First', sortable: true, filter: true },
    {
      headerName: 'Inspect',
      field: 'id',
      cellRenderer: LinkRendererComponent,
      cellRendererParams: {
        getHref: (params: any) => `/contactz/${params.id}`,
        text: 'View'
      },
    },
    { field: 'phone', headerName: 'Phone', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true },
    { 
      field: 'Volunteer?', 
      headerName: 'Is Volunteer?', 
      valueFormatter: (_params) => 'No', 
      sortable: true, 
      filter: true 
    }
  ];


  // grid row data
  rowData: Contact[] = [];

  private agPersist = new AgPersist('contact-list-preferences');
  public gridOptions = this.agPersist.setup();

  ngOnInit() {
    this.contactService.getContacts().subscribe((list) => {
      this.rowData = list || [];
      this.cd.detectChanges();
    });
  }
}
