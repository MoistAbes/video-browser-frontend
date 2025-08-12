import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'MainIconPathPipe'
})
export class MainIconPathPipe implements PipeTransform {

  transform(path: string): string {
    if (!path) return '';

    const parts: string[] = path.split('/');

    // Take the first two segments (or however many exist)
    const basePath: string = parts.slice(0, 2).join('/') + '/';

    // Append the icon path
    return `${basePath}icon/icon.webp`;
  }

}
