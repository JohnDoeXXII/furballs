import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal, AnimalService } from '../../services/animal.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { LinkRendererComponent } from '../../components/link/link-renderer.component';
import { AgPersist } from '../../services/ag-persist.mixin';
import { Link } from "../../components/link/link.component";

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, Link],
  templateUrl: './animal-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalListComponent implements OnInit {

  constructor(private animalService: AnimalService, private cd: ChangeDetectorRef) {}

  // AG Grid column definitions and row data
  columnDefs: ColDef[] = [
    { field: 'shelterId', headerName: 'Shelter ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    {
      headerName: 'Inspect',
      field: 'id',
      cellRenderer: LinkRendererComponent,
      cellRendererParams: {
        getHref: (params: any) => `/animalz/${params.id}`,
        text: 'View'
      },
      sortable: false,
      filter: false,
      width: 100,
    },
    { field: 'type', headerName: 'Type', sortable: true, filter: true },
    { 
      field: 'dateOfBirth', 
      headerName: 'Age (Months)', 
      sortable: true, 
      valueFormatter: (params: any | Date) => {
        var dob = new Date(params.data.dateOfBirth);
        if (dob instanceof Date) {
          var months;
          var now = new Date();
          months = (now.getFullYear() - dob.getFullYear()) * 12;
          months -= now.getMonth();
          months += dob.getMonth();
          return '' + (months <= 0 ? 0 : months);
        } else {
          return '';
        }
      }
    },
  ];

  // grid row data
  rowData: Animal[] = [];

  private agPersist = new AgPersist('animal-list-preferences');
  public gridOptions = this.agPersist.setup();

  ngOnInit() {
    this.animalService.getAnimals().subscribe((list) => {
      this.rowData = list || [];
      this.cd.detectChanges();
    });
  }
}
