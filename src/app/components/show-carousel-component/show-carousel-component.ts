import { Component, Input, type OnInit } from '@angular/core';
import { ShowModel } from '../../models/show/show-model';
import { UtilService } from '../../services/local/util-service';
import { VideoCardComponent } from "../video-card-component/video-card-component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-carousel-component',
  imports: [VideoCardComponent],
  templateUrl: './show-carousel-component.html',
  styleUrl: './show-carousel-component.scss',
})
export class ShowCarouselComponent implements OnInit {
  @Input() shows: ShowModel[] = [];
  @Input() carouselTitle: string = '';

  constructor(
    private router: Router,
    public utilService: UtilService,
  ) {}

  ngOnInit(): void {}

   moveToMovieDetails(title: string) {
    this.router.navigate(['/movie-details', title])
      .catch(error => {
        console.error('❌ Błąd podczas nawigacji:', error);
      });
  }
}
