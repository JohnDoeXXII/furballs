import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Link } from './link.component';

@Component({
  selector: 'app-link-renderer',
  template: `<app-link [href]="href" [text]="text"></app-link>`,
  standalone: true,
  imports: [Link]
})
export class LinkRendererComponent implements ICellRendererAngularComp {
  href: string = '';
  text: string = 'View';

  agInit(params: any): void {
    if (params && params.getHref && params.data.id) {
      if (params.getHref && typeof params.getHref === 'function') {
        this.href = params.getHref(params.data);
      }
    }
    if (params && params.text) this.text = params.text;
  }

  refresh(params: any): boolean {
    return false;
  }
}
