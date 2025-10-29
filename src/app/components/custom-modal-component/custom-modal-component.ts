import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScreenOverlayComponent } from '../screen-overlay-component/screen-overlay-component';

@Component({
  selector: 'app-custom-modal-component',
  imports: [ScreenOverlayComponent],
  templateUrl: './custom-modal-component.html',
  standalone: true,
  styleUrl: './custom-modal-component.scss',
})
export class CustomModalComponent {
  @Input() title: string = 'Modal';
  @Input() content: string = 'Czy na pewno chcesz kontynuować?';
  @Input() confirmText: string = 'OK';
  @Input() cancelText: string = 'Anuluj';
  @Input() showCancel: boolean = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @Input() confirmAction: () => void = () => {};

  onConfirm() {
    if (this.confirmAction) {
      this.confirmAction();
    }
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
