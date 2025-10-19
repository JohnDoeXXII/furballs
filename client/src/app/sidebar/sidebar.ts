import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  sidebarVisible = true;

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
