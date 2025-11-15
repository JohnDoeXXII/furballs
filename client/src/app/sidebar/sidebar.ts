import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AnimalService } from '../services/animal.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sidebar.scss',
  imports: [JsonPipe, RouterLink]
})
export class Sidebar implements OnInit {
  sidebarVisible = true;
  private readonly STORAGE_KEY = 'sidebarVisible';
  catCount = signal<number>(0);
  dogCount = signal<number>(0);

  constructor(
    private router: Router,
    private animalService: AnimalService,
    protected sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loadSidebarStateFromStorage();
    this.loadAnimalCounts();
  }

  private loadAnimalCounts() {
    this.animalService.getAnimalCountByType('Cat').subscribe(this.catCount.set);
    this.animalService.getAnimalCountByType('Dog').subscribe(this.dogCount.set);
  }

  private loadSidebarStateFromStorage() {
    const storedValue = localStorage.getItem(this.STORAGE_KEY);
    if (storedValue !== null) {
      this.sidebarVisible = storedValue === 'true';
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    localStorage.setItem(this.STORAGE_KEY, this.sidebarVisible.toString());
  }

  logout() {
    this.sessionService.clearSession();
    this.router.navigate(['/login']);
  }
}
