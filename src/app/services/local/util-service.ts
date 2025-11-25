import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints/endpoints';
import { MediaItemModel } from '../../models/show/media-item-model';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  normalizeText(text: string): string {
    return text
      .normalize('NFD') // rozdziela znaki diakrytyczne
      .replace(/[\u0300-\u036f]/g, '') // usuwa diakrytyki
      .replace(/\s+/g, '') // usuwa wszystkie spacje
      .toLowerCase()
      .trim();
  }

  formatVideoDuration(seconds: number): string {
    const h: number = Math.floor(seconds / 3600);
    const m: number = Math.floor((seconds % 3600) / 60);

    if (h > 0) {
      return `${h}h ${m}m`;
    } else {
      return `${m}m`;
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  getVideoUrlPreview(mediaItem: MediaItemModel): string {
    const fullVideoPath: string = `${mediaItem.rootPath}/${mediaItem.fileName}`;

    let resultVideoUrl: string = '';

    resultVideoUrl = `${Endpoints.stream.normalPreview}?path=${encodeURIComponent(fullVideoPath)}`;

    return resultVideoUrl;
  }
}
