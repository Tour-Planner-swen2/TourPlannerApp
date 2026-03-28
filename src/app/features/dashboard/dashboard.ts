import { Component } from '@angular/core';

import { TourList } from './components/tour-list/tour-list';
import { SearchBar } from './components/search-bar/search-bar';
import { Map } from './components/map/map';
import { TourDetails } from './components/tour-details/tour-details';

@Component({
  selector: 'app-dashboard',
  imports: [TourList, SearchBar, Map, TourDetails],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
