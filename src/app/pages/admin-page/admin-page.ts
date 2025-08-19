import {Component, OnInit} from '@angular/core';
import {VideoApi} from '../../services/api/video-api';
import {FormsModule} from '@angular/forms';
import {ShowApiService} from '../../services/api/show-api-service';
import {ShowModel} from '../../models/show-model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgSelectComponent} from '@ng-select/ng-select';
import {CategoryApiService} from '../../services/api/category-api-service';
import {CategoryModel} from '../../models/category-model';

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

 categories: CategoryModel[] = []

  constructor(private videoApiService: VideoApi,
              private showApiService: ShowApiService,
              private categoryApiService: CategoryApiService) {}

  ngOnInit(): void {
    this.testFindAllShows()
    this.findAllCategories();

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

  findAllCategories() {
    this.categoryApiService.findAllCategories().subscribe({
      next: value => {
        this.categories = value;
        console.log("categories: ", this.categories)
      },
      error: err => {
        console.log("Error: ", err)
      },
      complete: () => {}
    })
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
