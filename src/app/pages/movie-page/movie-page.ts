import { Component } from '@angular/core';
import {VideoTimelineComponent} from '../../components/video-timeline-component/video-timeline-component';

@Component({
  selector: 'app-movie-page',
  imports: [
    VideoTimelineComponent
  ],
  templateUrl: './movie-page.html',
  standalone: true,
  styleUrl: './movie-page.scss'
})
export class MoviePage {

  duration: number = 300;

}
