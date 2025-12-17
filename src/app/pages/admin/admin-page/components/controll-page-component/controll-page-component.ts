import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomModalComponent } from '../../../../../components/custom-modal-component/custom-modal-component';
import { ScanSessionModel } from '../../../../../models/camunda/scan-session-model';

@Component({
  selector: 'app-controll-page-component',
  imports: [CustomModalComponent],
  templateUrl: './controll-page-component.html',
  styleUrl: './controll-page-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControllPageComponent {
  @Input() scanSessionList: ScanSessionModel[] = [];
  @Output() fullLibraryScanStarted = new EventEmitter<void>();

  selectedScanSession: ScanSessionModel | undefined;

  modalContent: string = '';
  isModalVisible: boolean = false;
  confirmAction: () => void = () => {};

  setUpVideoScanModalValues() {
    this.modalContent = 'Czy na pewno chcesz przeprowadzić skanowanie plików video?';

    this.confirmAction = () => this.fullLibraryScan();

    this.isModalVisible = true;
  }

  fullLibraryScan() {
    this.fullLibraryScanStarted.emit();
  }

  onConfirmed() {
    this.isModalVisible = false;
  }

  onCancelled() {
    this.isModalVisible = false;
  }

  toggleScan(scanSession: ScanSessionModel) {
    // this.selectedScanSession = scanSession;
    this.selectedScanSession = this.selectedScanSession === scanSession ? undefined : scanSession;
  }
}
