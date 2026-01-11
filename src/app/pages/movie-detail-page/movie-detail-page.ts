import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Endpoints } from '../../endpoints/endpoints';
import { FormsModule } from '@angular/forms';
import { SingleMovieComponent } from './components/single-movie-component/single-movie-component';
import { SeasonsComponent } from './components/seasons-component/seasons-component';
import { SeriesComponent } from './components/series-component/series-component';
import { SeasonsAndMoviesComponent } from './components/seasons-and-movies-component/seasons-and-movies-component';
import { ShowApiService } from '../../services/api/show-api-service';
import { ShowModel } from '../../models/show/show-model';
import { MediaItemModel } from '../../models/show/media-item-model';
import { StructureTypeEnum } from '../../enums/structure-type-enum';
import { StreamKeyService } from '../../services/local/stream-key-service';
import { VideoApi } from '../../services/api/video-api';
import { SubtitleModel } from '../../models/show/subtitle-model';

@Component({
  standalone: true,
  selector: 'app-movie-detail-page',
  imports: [
    FormsModule,
    SingleMovieComponent,
    SeasonsComponent,
    SeriesComponent,
    SeasonsAndMoviesComponent,
  ],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.scss',
})
export class MovieDetailPage implements OnInit {
  protected readonly StructureTypeEnum = StructureTypeEnum;

  show: ShowModel | undefined;
  currentMediaItem: MediaItemModel | undefined;
  selectedVideoUrl: string = '';
  selectedBackdropUrl: string = '';
  subtitlesUrl: string = '';
  selectedSubtitles: SubtitleModel | undefined;

  selectedSeason: number | null = null;

  isVideoPlaying: boolean = false;
  private seekStartTime: number = 0;

  streamAuthKey: string = '';

  constructor(
    private route: ActivatedRoute,
    private showApiService: ShowApiService,
    private streamKeyService: StreamKeyService,
    private videoApiService: VideoApi
  ) {}

  ngOnInit() {
    const parentTitle: string = this.route.snapshot.params['parentTitle'];
    this.findShowDetailByParentTitle(parentTitle);
  }

  loadBackdropImage(rootPath: string) {
    this.videoApiService.getBackdropBlob(rootPath).subscribe({
      next: (blob) => {
        this.selectedBackdropUrl = URL.createObjectURL(blob);
      },
      error: () => {
        this.selectedBackdropUrl = '';
      },
    });
  }

  findShowDetailByParentTitle(parentTitle: string): void {
    this.showApiService.findShowByParentTitle(parentTitle).subscribe({
      next: (data) => {
        this.show = data;

        console.log('show details: ', this.show);

        this.loadBackdropImage(this.show.rootPath);
      },
      error: (err) => {
        console.log('Error while findShowDetailByParentTitle: ', err);
      },
      complete: () => {
        this.determineVideoCategory();
      },
    });
  }

  onUpdateVideoData(update: Partial<MediaItemModel>) {
    this.currentMediaItem = {
      ...this.currentMediaItem,
      ...update,
    } as MediaItemModel;

    this.loadBackdropImage(this.currentMediaItem.rootPath);

    //reset video data
    this.isVideoPlaying = false;
    this.selectedVideoUrl = '';
  }

  private updateVideoUrl(key: string) {
    if (!this.currentMediaItem) return;

    const fullVideoPath = `${this.currentMediaItem.rootPath}/${this.currentMediaItem.fileName}`;

    this.selectedVideoUrl = `${Endpoints.stream.normal}?path=${encodeURIComponent(
      fullVideoPath
    )}&authKey=${key}`;
  }

  async playVideo() {
    if (!this.currentMediaItem) return;

    console.log('play video is running test');

    this.isVideoPlaying = true;

    // Pobieramy klucz z serwisu
    const key = await this.streamKeyService.getValidKey();

    // Aktualizujemy URL video
    this.updateVideoUrl(key);

    if (this.currentMediaItem.subtitles.length == 0) {
      return;
    }

    this.selectedSubtitles = this.currentMediaItem.subtitles[0];

    this.videoApiService
      .getSubtitleBlob(this.currentMediaItem.rootPath, this.currentMediaItem.subtitles[0].filename)
      .subscribe((blob) => {
        this.subtitlesUrl = URL.createObjectURL(blob);
      });
  }

  async onSeekTimeSelected(time: number) {
    this.seekStartTime = time;

    // pobieramy aktualny key z serwisu
    const key = await this.streamKeyService.getValidKey();

    // aktualizujemy URL z kluczem
    this.updateVideoUrl(key);
  }

  determineVideoCategory() {
    if (this.show?.structure == StructureTypeEnum.SINGLE_MOVIE) {
      this.currentMediaItem = this.show!.movies[0]!;
    } else if (this.show?.structure == StructureTypeEnum.SEASONAL_SERIES) {
      this.currentMediaItem = this.show!.seasons[0].episodes[0]!;
    } else if (this.show?.structure == StructureTypeEnum.MOVIE_COLLECTION) {
    } else if (this.show?.structure == StructureTypeEnum.HYBRID) {
    } else {
      console.warn('Nieznany typ struktury show:', this.show?.structure);
    }
  }

  onSubtitlesSelected(selectedSubtitles: SubtitleModel | undefined) {
    if (!this.currentMediaItem) return;

    console.log('selected subtitles in movie details page: ', selectedSubtitles);

    this.selectedSubtitles = selectedSubtitles;

    if (!selectedSubtitles) {
      this.subtitlesUrl = '';
      return;
    }

    this.videoApiService
      .getSubtitleBlob(this.currentMediaItem.rootPath, selectedSubtitles.filename)
      .subscribe((blob) => {
        this.subtitlesUrl = URL.createObjectURL(blob);
      });

    console.log('subtitle url: ', this.subtitlesUrl);
  }
}
