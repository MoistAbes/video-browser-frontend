import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ShowModel } from '../../../../../models/show/show-model';
import { FormsModule } from '@angular/forms';
import { SeasonModel } from '../../../../../models/show/season-model';
import { CustomModalComponent } from '../../../../../components/custom-modal-component/custom-modal-component';

@Component({
  selector: 'app-shows-page-component',
  imports: [FormsModule, CustomModalComponent],
  templateUrl: './shows-page-component.html',
  styleUrl: './shows-page-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowsPageComponent implements OnChanges {
  @Input() shows: ShowModel[] = [];
  @Output() showDeleted = new EventEmitter<number>();
  @Output() seasonDeleted = new EventEmitter<{ seasonId: number; showId: number }>();
  @Output() episodeDeleted = new EventEmitter<{
    episodeId: number;
    seasonId: number;
    showId: number;
  }>();

  filteredShows: ShowModel[] = [];
  selectedShow?: ShowModel;
  selectedSeason?: SeasonModel;

  idShowFilterValue: number | undefined;
  nameShowFilterValue: string = '';
  genreFilterValue: string = '';

  modalContent: string = '';
  isModalVisible: boolean = false;
  confirmAction: () => void = () => {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shows'] && this.shows) {
      // Gdy przyjdą dane z rodzica, inicjalizujemy filteredUsers
      this.applyFilter();
    }
  }

  setUpShowDeleteModal(showId: number, showName: string) {
    this.modalContent = 'Do you want to delete show: ' + showName + ' id: ' + showId;

    this.confirmAction = () => this.deleteShow(showId);

    this.isModalVisible = true;
  }

  setUpSeasonDeleteModal(seasonId: number, showId: number, number: number) {
    this.modalContent = 'Do you want to delete season: ' + number + ' id: ' + seasonId;

    this.confirmAction = () => this.deleteSeason(seasonId, showId);

    this.isModalVisible = true;
  }

  setUpEpisodeDeleteModal(episodeId: number, seasonId: number, showId: number, number: number) {
    this.modalContent =
      'Do you want to delete episode: ' + episodeId + ' id: from season: ' + number;

    this.confirmAction = () => this.deleteEpisode(episodeId, seasonId, showId);

    this.isModalVisible = true;
  }

  deleteShow(showId: number) {
    this.showDeleted.emit(showId);
  }

  deleteSeason(seasonId: number, showId: number) {
    this.seasonDeleted.emit({ seasonId: seasonId, showId: showId });
  }

  deleteEpisode(episodeId: number, seasonId: number, showId: number) {
    this.episodeDeleted.emit({ episodeId: episodeId, seasonId: seasonId, showId: showId });
  }

  toggleShow(show: ShowModel) {
    this.selectedShow = this.selectedShow === show ? undefined : show;
    this.selectedSeason = undefined; // reset poziomu 3
  }

  toggleSeason(season: SeasonModel, event: Event) {
    event.stopPropagation();

    this.selectedSeason = this.selectedSeason === season ? undefined : season;
  }

  setUpShowDeleteModalValues(show: ShowModel) {}

  applyFilter() {
    this.filteredShows = this.shows.filter((show) => {
      const matchesId = !this.idShowFilterValue || show.id === this.idShowFilterValue;

      const matchesName =
        !this.nameShowFilterValue ||
        show.name.toLowerCase().includes(this.nameShowFilterValue.toLowerCase());

      const matchesGenre =
        !this.genreFilterValue ||
        show.genres.some((genre) =>
          genre.name.toLowerCase().includes(this.genreFilterValue.toLowerCase())
        );

      return matchesId && matchesName && matchesGenre;
    });
  }

  onConfirmed() {
    this.isModalVisible = false;
  }

  onCancelled() {
    this.isModalVisible = false;
  }

  

}
