import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, EventService } from '../../services/event.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { LinkRendererComponent } from '../../components/link/link-renderer.component';
import { AgPersist } from '../../services/ag-persist.mixin';
import { Router } from '@angular/router';
import { Link } from '../../components/link/link.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, Link],
  templateUrl: './event-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit {

  constructor(private eventService: EventService, private cd: ChangeDetectorRef) {}

  // AG Grid column definitions and row data
  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'description', headerName: 'Description', sortable: true, filter: true },
    { 
      field: 'startDatetime', 
      headerName: 'Start Date', 
      sortable: true,
      valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleString();
      }
    },
    { 
      field: 'endDatetime', 
      headerName: 'End Date', 
      sortable: true,
      valueFormatter: (params: any) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    {
      headerName: 'Inspect',
      field: 'id',
      cellRenderer: LinkRendererComponent,
      cellRendererParams: {
        getHref: (params: any) => `/eventz/${params.id}`,
        text: 'View'
      },
      sortable: false,
      filter: false,
      width: 100,
    },
  ];

  // grid row data
  rowData: Event[] = [];

  private agPersist = new AgPersist('event-list-preferences');
  public gridOptions = this.agPersist.setup();

  ngOnInit() {
    this.eventService.getAll().subscribe((list) => {
      this.rowData = list || [];
      this.cd.detectChanges();
    });
  }
}
