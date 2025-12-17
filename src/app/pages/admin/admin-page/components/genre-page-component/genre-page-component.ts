import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GenreModel } from '../../../../../models/show/genre-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genre-page-component',
  imports: [FormsModule],
  templateUrl: './genre-page-component.html',
  styleUrl: './genre-page-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenrePageComponent implements OnChanges {
  @Input() genres: GenreModel[] = [];
  filteredGenres: GenreModel[] = [];

  filterIdValue: number | undefined;
  filterNameValue: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['genres'] && this.genres) {
      // Gdy przyjdą dane z rodzica, inicjalizujemy filteredUsers
      this.applyFilter();
    }
  }

  applyFilter() {
    if (!this.genres) return;

    this.filteredGenres = this.genres.filter((g) => {
      const matchesId = this.filterIdValue ? g.id === this.filterIdValue : true;
      const matchesName = this.filterNameValue
        ? g.name.toLowerCase().includes(this.filterNameValue.toLowerCase())
        : true;

      return matchesId && matchesName;
    });
  }
}
