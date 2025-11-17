import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HoverPreviewService } from '../../services/local/hover-preview-service';
import { ShowApiService } from '../../services/api/show-api-service';
import { ShowModel } from '../../models/show/show-model';
import { UtilService } from '../../services/local/util-service';
import { ShowUtilService } from '../../services/local/show-util-service';
import { MediaItemModel } from '../../models/show/media-item-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-card-component',
  imports: [NgOptimizedImage],
  templateUrl: './video-card-component.html',
  standalone: true,
  styleUrl: './video-card-component.scss',
})
export class VideoCardComponent {
  @Input() title: string = '';
  @Input() iconFilePath!: string;
  @Input() showPreview: boolean = false;
  @Input() showId: number | undefined;
  @Output() cardClick = new EventEmitter<void>();

  private apiSub?: Subscription;

  show: ShowModel | undefined;
  mediaItemToPlay: MediaItemModel | undefined;

  @ViewChild('cardRef') cardRef!: ElementRef;

  openTimer: ReturnType<typeof setTimeout> | null = null;
  constructor(
    private utilService: UtilService,
    private showUtilService: ShowUtilService,
    private showApiService: ShowApiService,
    private hoverPreview: HoverPreviewService,
    private el: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef, // 👈 dodaj to
    private zone: NgZone // 👈 dodaj to
  ) {}

  onClick() {
    this.cardClick.emit();
  }

  @HostListener('mouseenter')
  onEnter() {
    console.log('ON ENTER');

    if (!this.showPreview) return;
    if (this.openTimer) clearTimeout(this.openTimer);

    this.loadShowDetails();
  }

  @HostListener('mouseleave')
  onLeave() {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    this.hoverPreview.scheduleClose(0);
  }

  loadShowDetails() {
    console.log('loadShowDetails is running');
    if (this.showId == undefined) return;

    // 👉 ANULUJ POPRZEDNIE REQUESTY
    if (this.apiSub) {
      this.apiSub.unsubscribe();
      this.apiSub = undefined;
    }

    this.apiSub = this.showApiService.findById(this.showId).subscribe({
      next: (result) => {
        this.show = result;
        this.mediaItemToPlay = this.showUtilService.findFirstMediaItemToPlay(this.show!);
        this.cdr.detectChanges();
      },
      complete: () => {
        // 200 ms zamiast 1000 ms
        const previewDelay = 200;

        this.openTimer = setTimeout(() => {
          this.openTimer = null;

          this.zone.runOutsideAngular(() => {
            this.hoverPreview.updateAnchor(this.el.nativeElement, {
              title: this.title,
              description: this.show!.description,
              genres: this.show!.genres,
              seasonsAmount: this.show?.seasons.length ?? 0,
              moviesAmount: this.show?.movies.length ?? 0,
              videoLength: this.show?.movies?.[0]?.duration ?? 0,
              videoSrc: this.utilService.getVideoUrlPreview(this.mediaItemToPlay!),
            });
          });
        }, previewDelay);
      },
    });
  }

  // loadShowDetails() {
  //   console.log('loadShowDetails is running');
  //   if (this.showId == undefined) return;

  //   this.showApiService.findById(this.showId).subscribe({
  //     next: (result) => {
  //       this.show = result;
  //       this.mediaItemToPlay = this.showUtilService.findFirstMediaItemToPlay(
  //         this.show!
  //       );
  //       this.cdr.detectChanges(); // 👈 powiadom Angulara o zmianach
  //     },
  //     complete: () => {
  //       this.openTimer = setTimeout(() => {
  //         this.openTimer = null;

  //         // 👇 WYWOŁAJ POZA STREFĄ ANGULARA
  //         this.zone.runOutsideAngular(() => {
  //           this.hoverPreview.updateAnchor(this.el.nativeElement, {
  //             title: this.title,
  //             description: this.show!.description,
  //             videoSrc: this.utilService.getVideoUrlPreview(
  //               this.mediaItemToPlay!
  //             ),
  //           });
  //         });
  //       }, 1000);
  //     },
  //   });
  // }
}
