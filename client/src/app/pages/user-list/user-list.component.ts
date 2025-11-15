import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken, OnInit, Optional, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../services/user.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { LinkRendererComponent } from '../../components/link/link-renderer.component';
import { AgPersist } from '../../services/ag-persist.mixin';
import { Link } from '../../components/link/link.component';

/**
 * Injection token for overriding the LinkRenderer in tests
 */
export const LINK_RENDERER = new InjectionToken<Type<any>>('LINK_RENDERER', {
  providedIn: 'root',
  factory: () => LinkRendererComponent
});

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, Link],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private cd: ChangeDetectorRef,
    @Optional() @Inject(LINK_RENDERER) private linkRenderer?: Type<any>
  ) {
    // Initialize columnDefs after injection is complete
    this.columnDefs = this.createColumnDefs();
  }

  // AG Grid column definitions and row data
  columnDefs: ColDef[];
  
  private createColumnDefs(): ColDef[] {
    return [
      { field: 'username', headerName: 'Username', sortable: true, filter: true },
      { field: 'email', headerName: 'Email', sortable: true, filter: true },
      { field: 'firstName', headerName: 'First Name', sortable: true, filter: true },
      { field: 'lastName', headerName: 'Last Name', sortable: true, filter: true },
      { field: 'phone', headerName: 'Phone', sortable: true, filter: true },
      { field: 'isAdmin', headerName: 'Admin', sortable: true, filter: true },
      {
        headerName: 'Inspect',
        field: 'id',
        cellRenderer: this.linkRenderer || LinkRendererComponent,
        cellRendererParams: {
          getHref: (params: any) => `/userz/${params.id}`,
          text: 'View'
        },
        sortable: false,
        filter: false,
        width: 100,
      },
    ];
  }

  // grid row data
  rowData: User[] = [];

  private agPersist = new AgPersist('user-list-preferences');
  public gridOptions = this.agPersist.setup();

  ngOnInit() {
    this.userService.getAll().subscribe((list) => {
      this.rowData = list || [];
      this.cd.detectChanges();
    });
  }
}
