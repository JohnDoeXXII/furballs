import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link.component.html'
})
export class Link {

  // Accept either `href` input (aliased) and optional `text` for link label
  @Input('href') hrefVal: string = '';
  @Input() text: string = 'View';

}
