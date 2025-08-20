import {Component, OnInit} from '@angular/core';
import {VideoApi} from '../../services/api/video-api';
import {FormsModule} from '@angular/forms';
import {ShowApiService} from '../../services/api/show-api-service';
import {ShowModel} from '../../models/show-model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgSelectComponent} from '@ng-select/ng-select';


@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule,
    MatTabGroup,
    MatTab,
    NgSelectComponent
  ],
  templateUrl: './admin-page.html',
  standalone: true,
  styleUrl: './admin-page.scss'
})
export class AdminPage implements OnInit {

 showList: ShowModel[] = [];
 selectedShow: ShowModel | undefined;


  constructor(private videoApiService: VideoApi,
              private showApiService: ShowApiService) {}

  ngOnInit(): void {
    this.testFindAllShows()

  }




  scanAllMovies() {
    console.log('ScanAllMovies');
    this.videoApiService.scanAllVideos().subscribe({
      next: (result) => {

      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('ScanAllMovies complete');
      }
    })
  }

  filterVideoInfo() {


  }




  testFindAllShows() {
    this.showApiService.findAllShows().subscribe({
      next: (result) => {
        this.showList = result
        this.showList.sort((a, b) => a.id! - b.id!)
        console.log("SHOWS: ", result);
      },
      error: (err) => {
        console.log("Error while loading shows: ", err);
      },
      complete: () => {}
    })
  }

  onShowRowClick(show: ShowModel) {
    this.selectedShow = show;
  }
}
