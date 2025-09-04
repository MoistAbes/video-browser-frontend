import {
  Component,
  ComponentRef,
  ElementRef, EmbeddedViewRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {VideoCardInfoPanelComponent} from './video-card-info-panel-component/video-card-info-panel-component';


@Component({
  selector: 'app-video-card-component',
  imports: [
    NgOptimizedImage

  ],
  templateUrl: './video-card-component.html',
  standalone: true,
  styleUrl: './video-card-component.scss'
})
export class VideoCardComponent implements OnDestroy{

  @Input() title: string = '';
  @Input() iconFilePath!: string;
  @Input() showPreview: boolean = false;
  @Output() cardClick = new EventEmitter<void>();

  @ViewChild('cardRef') cardRef!: ElementRef;
  private infoPanelRef: ComponentRef<VideoCardInfoPanelComponent> | null = null;


  constructor(
    private viewContainerRef: ViewContainerRef
  ) {}

  onClick() {
    this.cardClick.emit();
  }

  onMouseEnter() {

    if (!this.showPreview)  {
      return;
    }

    const rect = this.cardRef.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const panelWidth = 300;
    const panelHeight = 240;

    let left = rect.left;
    let top = rect.top - panelHeight - 10;

    if (left + panelWidth > viewportWidth) {
      left = viewportWidth - panelWidth - 10;
      if (left < 10) left = 10;
    }

    this.infoPanelRef = this.viewContainerRef.createComponent(VideoCardInfoPanelComponent);
    this.infoPanelRef.instance.title = this.title;
    this.infoPanelRef.instance.description = 'Opis filmu...';
    this.infoPanelRef.instance.top = top;
    this.infoPanelRef.instance.left = left;

    const domElem = (this.infoPanelRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    // Znajdź wewnętrzny div z klasą .info-panel-fixed
    const panelDiv = domElem.querySelector('.info-panel-fixed');
    if (panelDiv) {
      panelDiv.classList.add('info-panel-fixed'); // na wszelki wypadek
      requestAnimationFrame(() => {
        panelDiv.classList.add('show');
      });
    }

  }


  onMouseLeave() {

    if (!this.showPreview)  {
      return;
    }

    if (this.infoPanelRef) {
      const domElem = (this.infoPanelRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      const panelDiv = domElem.querySelector('.info-panel-fixed');
      if (panelDiv) {
        panelDiv.classList.remove('show');
        panelDiv.classList.add('hide');

        setTimeout(() => {
          this.infoPanelRef?.destroy();
          this.infoPanelRef = null;
        }, 300);
      }
    }
  }

  ngOnDestroy() {

    if (!this.showPreview)  {
      return;
    }

    this.onMouseLeave();
  }

}
