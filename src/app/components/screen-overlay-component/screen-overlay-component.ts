import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-screen-overlay-component',
  imports: [],
  templateUrl: './screen-overlay-component.html',
  standalone: true,
  styleUrl: './screen-overlay-component.scss'
})
export class ScreenOverlayComponent {

  @Input() isOverlayVisible = false;
  @Output() overlayClicked = new EventEmitter<void>();



  onOverlayClick() {
    this.overlayClicked.emit();
  }

}
