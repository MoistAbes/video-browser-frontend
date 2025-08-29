import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

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
  @Output() cardClick = new EventEmitter<void>();

  onClick() {
    this.cardClick.emit();
  }

}
