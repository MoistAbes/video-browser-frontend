import {
  Component,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {HoverPreviewService} from '../../services/local/hover-preview-service';


@Component({
  selector: 'app-video-card-component',
  imports: [
    NgOptimizedImage

  ],
  templateUrl: './video-card-component.html',
  standalone: true,
  styleUrl: './video-card-component.scss'
})
export class VideoCardComponent {

  @Input() title: string = '';
  @Input() iconFilePath!: string;
  @Input() showPreview: boolean = false;
  @Output() cardClick = new EventEmitter<void>();

  @ViewChild('cardRef') cardRef!: ElementRef;


  private openTimer: number | null = null;
  constructor(private hoverPreview: HoverPreviewService, private el: ElementRef<HTMLElement>) {}

  onClick() {
    this.cardClick.emit();
  }

  @HostListener('mouseenter')
  onEnter() {
    // Jeśli false, to hover preview jest wyłączony — nic się nie dzieje.
    if (!this.showPreview) return;
    // Jeśli użytkownik szybko hoveruje i poprzedni setTimeout jeszcze nie zdążył się wykonać,
    // to go anulujemy — zapobiega to wywołaniu updateAnchor() dla poprzedniej karty.
    if (this.openTimer) clearTimeout(this.openTimer);

    this.openTimer = setTimeout(() => {
      this.openTimer = null;
      this.hoverPreview.updateAnchor(this.el.nativeElement, {
        title: this.title,
        description: 'Opis filmu…',
        videoSrc: 'sample.mp4'
      });
    }, 1000);
  }


  @HostListener('mouseleave')
  onLeave() {
    if (this.openTimer) { clearTimeout(this.openTimer); this.openTimer = null; }
    this.hoverPreview.scheduleClose(220);
  }

}
