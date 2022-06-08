import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {

  constructor() { }

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList();

  ngAfterContentInit(): void {
    console.log(this.tabs)
  }

}
