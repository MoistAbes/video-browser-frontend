import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { SimpleTabComponent } from '../simple-tab.component/simple-tab.component';

@Component({
  selector: 'app-simple-tabs',
  standalone: true,
  imports: [],
  templateUrl: './simple-tabs-component.html',
  styleUrls: ['./simple-tabs-component.scss'],
})
export class SimpleTabsComponent implements AfterContentInit {
  @ContentChildren(SimpleTabComponent) tabs!: QueryList<SimpleTabComponent>;
  selectedIndex = 0;

  ngAfterContentInit() {
    this.selectTab(0);
  }

  selectTab(index: number) {
    this.selectedIndex = index;
    this.tabs.forEach((tab, i) => (tab.active = i === index));
  }
}
