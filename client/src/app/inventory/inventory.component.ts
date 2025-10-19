import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal, AnimalService } from '../services/animal.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit {

  constructor(private animalService: AnimalService) {}

  // Simple mock list for now
  animals$: Observable<Animal[]> = new BehaviorSubject<Animal[]>([]).asObservable();

  ngOnInit() {
    this.animals$ = this.animalService.getAnimals();
 }
}
