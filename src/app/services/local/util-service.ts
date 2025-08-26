import { Injectable } from '@angular/core';
import {Endpoints} from '../../endpoints/endpoints';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }


  normalizeText(text: string): string {
    return text
      .normalize("NFD") // rozdziela znaki diakrytyczne
      .replace(/[\u0300-\u036f]/g, "") // usuwa diakrytyki
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

  getBackdropUrl(rootPath: string | undefined): string {
    if (!rootPath) {
      return ""
    }
    return `${Endpoints.videos.image}?path=${encodeURIComponent(rootPath + '/backdrop/backdrop.jpg')}`;
  }



  getIconUrl(rootPath: string | undefined): string {
    if (!rootPath) {
      return ""
    }

    return `${Endpoints.videos.image}?path=${encodeURIComponent(rootPath + '/icon/icon.webp')}`;
  }



  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }


}
