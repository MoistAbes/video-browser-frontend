import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { VideoPreviewPlayerComponent } from '../../video-preview-player-component/video-preview-player-component';
import { GenreModel } from '../../../models/show/genre-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-card-info-panel-component',
  imports: [VideoPreviewPlayerComponent, CommonModule],
  templateUrl: './video-card-info-panel-component.html',
  standalone: true,
  styleUrl: './video-card-info-panel-component.scss',
})
export class VideoCardInfoPanelComponent implements OnDestroy {
  @Input() title = '';
  @Input() description = '';
  @Input() videoSrc = '';
  @Input() genres: GenreModel[] = [];
  @Input() formattedShowInfo: string = '' //tutaj przesylam informacje zalezna od struktury show czyli ilosc sezonow ilosc movies czas filmu itd.
  @Input() poster?: string;

  @Input() top = 0;
  @Input() left = 0;
  @Input() position: 'top' | 'right' | 'left' | 'bottom' = 'top';

  @Output() closeRequested = new EventEmitter<void>();
  @Output() mouseEntered = new EventEmitter<void>();
  @Output() mouseLeft = new EventEmitter<void>();

  @ViewChild('preview', { static: false }) previewRef?: {
    nativeElement: HTMLVideoElement;
  };

  playPreview() {
    const v = this.previewRef?.nativeElement;
    if (!v) return;
    // jeśli src jest ustawiony, spróbuj odtworzyć; błędy ignorujemy (autoplay polityki)
    v.muted = true;
    v.play().catch(() => {
      /* ignore */
    });
  }

  pauseAndUnload() {
    const v = this.previewRef?.nativeElement;
    if (!v) return;
    try {
      v.pause();
      // Zwolnij buffery – ważne, gdy user jeździ po wielu kartach
      v.removeAttribute('src');
      while (v.firstChild) v.removeChild(v.firstChild);
      // Opcjonalnie: wstaw ponownie <source> po ponownym otwarciu (tu prostsze podejście: dynamicznie w template)
    } catch {}
  }

  ngOnDestroy() {
    this.pauseAndUnload();
  }
}
