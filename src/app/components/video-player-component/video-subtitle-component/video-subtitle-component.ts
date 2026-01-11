import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatNavList } from '@angular/material/list';
import { SubtitleModel } from '../../../models/show/subtitle-model';

@Component({
  selector: 'app-video-subtitle-component',
  imports: [MatTabGroup, MatTab, MatNavList],
  templateUrl: './video-subtitle-component.html',
  styleUrl: './video-subtitle-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSubtitleComponent {
  @Input() subtitleList: SubtitleModel[] = [];
  @Input() selectedSubtitlesInput: SubtitleModel | undefined;
  @Output() selectedSubtitles = new EventEmitter<SubtitleModel | undefined>();
  constructor() {}

  selectSubtitleLanguage(subtitle: SubtitleModel | undefined) {
    console.log('selected subtitles: ', subtitle);
    this.selectedSubtitles.emit(subtitle);
  }

  isSubtitleDisabled(): boolean {
    return this.selectedSubtitlesInput == null;
  }

  isSubtitleSelected(subtitle: SubtitleModel): boolean {
    console.log('selected subtitle input: ', this.selectedSubtitlesInput);
    return this.selectedSubtitlesInput?.filename === subtitle.filename;
  }
}
