import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './sidebar/sidebar';
import { HttpClientJsonpModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('furballz');
}
