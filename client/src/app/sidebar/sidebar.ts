import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sidebar.scss',
  imports: []
})
export class Sidebar implements OnInit {
  sidebarVisible = true;
  private readonly STORAGE_KEY = 'sidebarVisible';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadSidebarStateFromStorage();
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
}
