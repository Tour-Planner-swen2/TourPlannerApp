import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TourFacade } from '../../../../core/facades/tour.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  private tourFacade = inject(TourFacade);
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed())
      .subscribe((searchTerm) => {
        this.tourFacade.filterTours(searchTerm);
      });
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }
}
