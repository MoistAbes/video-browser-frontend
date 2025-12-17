import { ScanSessionFileModel } from './scan-session-file-model';
export class ScanSessionModel {
  id: string = '';
  status: string = '';
  startedAt: Date | undefined;
  finishedAt: Date | undefined;
  mediaItemsAdded: number = 0;
  mediaItemsDeleted: number = 0;
  processedFiles: number = 0;
  errorMessage: string = '';
  scanSessionFileDtoList: ScanSessionFileModel[] = [];
}
