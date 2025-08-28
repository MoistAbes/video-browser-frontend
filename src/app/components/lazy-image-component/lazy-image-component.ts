import {Component, ElementRef, Input, OnInit, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-lazy-image-component',
  imports: [
    NgOptimizedImage
  ],

  template: `
    <img
      [ngSrc]="loaded() ? src : placeholder"
      [alt]="alt"
      fill
      (error)="onError()"
      class="lazy-image"
    />
  `,
  styles: [`
    .lazy-image {
      width: 100%;
      height: auto;
      display: block;
    }
  `],

  standalone: true,
  styleUrl: './lazy-image-component.scss'
})
export class LazyImageComponent implements OnInit{

  @Input() src!: string;
  @Input() alt: string = '';
  @Input() placeholder: string = 'assets/placeholder.jpg';

  loaded = signal(false);

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loaded.set(true);
          observer.unobserve(this.el.nativeElement);
        }
      });
    });

    observer.observe(this.el.nativeElement);
  }

  onError() {
    this.src = this.placeholder;
  }

}
