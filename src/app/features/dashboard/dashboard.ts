import { Component } from '@angular/core';

import { TourList } from './components/tour-list/tour-list';

@Component({
  selector: 'app-dashboard',
  imports: [ TourList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
