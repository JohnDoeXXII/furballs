import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal, AnimalService } from '../../services/animal.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { LinkRendererComponent } from '../../components/link/link-renderer.component';
import { AgPersist } from '../../services/ag-persist.mixin';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, AgGridModule],
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
        getHref: (params: any) => `/animal/${params.value}`,
        text: 'View'
      },
      sortable: false,
      filter: false,
      width: 100,
    },
    { field: 'type', headerName: 'Type', sortable: true, filter: true },
    { field: 'age', headerName: 'Age', sortable: true, filter: 'agNumberColumnFilter' },
  ];

  // grid row data
  rowData: Animal[] = [];

  private agPersist = new AgPersist('some-unique-name');
  public gridOptions = this.agPersist.setup();

  ngOnInit() {
    this.animalService.getAnimals().subscribe((list) => {
      this.rowData = list || [];
      this.cd.detectChanges();
    });
  }
}
