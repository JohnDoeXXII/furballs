import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal, AnimalService } from '../services/animal.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit {

  
  animals$: Observable<Animal[]> = new BehaviorSubject<Animal[]>([]).asObservable();

  constructor(private animalService: AnimalService) {}

  // AG Grid column definitions and row data
  columnDefs: ColDef[] = [
    { field: 'shelterId', headerName: 'Shelter ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    {
      headerName: 'Inspect',
      field: 'id',
      cellRenderer: (params: any) => {
        if (!params || !params.value) return '';
        return `<a href="/animal/${params.value}">View</a>`;
      },
      sortable: false,
      filter: false,
      width: 100,
    },
    { field: 'type', headerName: 'Type', sortable: true, filter: true },
    { field: 'age', headerName: 'Age', sortable: true, filter: 'agNumberColumnFilter' },
  ];

  ngOnInit() {
    this.animals$ = this.animalService.getAnimals();
  }
}
