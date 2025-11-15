import { ChangeDetectionStrategy, Component, OnInit, signal, output, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AnimalService } from '../services/animal.service';
import { SessionService } from '../services/session.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sidebar.scss',
  imports: [RouterLink]
})
export class Sidebar implements OnInit {
  sidebarVisible = signal(true);
  sidebarToggled = output<boolean>();
  private readonly STORAGE_KEY = 'sidebarVisible';
  private readonly MOBILE_BREAKPOINT = 1024; // Tailwind 'lg' breakpoint
  catCount = signal<number>(0);
  dogCount = signal<number>(0);

  constructor(
    private router: Router,
    private animalService: AnimalService,
    protected sessionService: SessionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadSidebarStateFromStorage();
    this.loadAnimalCounts();
    this.subscribeToRouteChanges();
  }

  private subscribeToRouteChanges() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Collapse sidebar on navigation if screen is below breakpoint
        if (window.innerWidth < this.MOBILE_BREAKPOINT && this.sidebarVisible()) {
          this.toggleSidebar();
        }
      });
    }
  }

  private loadAnimalCounts() {
    this.animalService.getAnimalCountByType('Cat').subscribe(this.catCount.set);
    this.animalService.getAnimalCountByType('Dog').subscribe(this.dogCount.set);
  }

  private loadSidebarStateFromStorage() {
    const storedValue = localStorage.getItem(this.STORAGE_KEY);
    if (storedValue !== null) {
      this.sidebarVisible.set(storedValue === 'true');
    }
    // Emit initial state to parent component
    this.sidebarToggled.emit(this.sidebarVisible());
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  toggleSidebar() {
    this.sidebarVisible.update(visible => !visible);
    localStorage.setItem(this.STORAGE_KEY, this.sidebarVisible().toString());
    this.sidebarToggled.emit(this.sidebarVisible());
  }

  logout() {
    this.sessionService.clearSession();
    this.router.navigate(['/login']);
  }
}
