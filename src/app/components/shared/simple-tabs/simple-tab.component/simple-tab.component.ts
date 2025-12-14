import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simple-tab',
  standalone: true,
  template: `
    @if (active) {
    <ng-content></ng-content>
    }
  `,
})
export class SimpleTabComponent {
  @Input() title!: string;
  active = false;
}
