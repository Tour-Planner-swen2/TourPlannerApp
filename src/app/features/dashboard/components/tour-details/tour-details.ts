import { Component, effect, inject, Signal } from '@angular/core';
import { TourFacade } from '../../../../core/facades/tour.facade';
import { Tour } from '../../../../core/models/tour.model';
import { TourLog } from '../../../../core/models/tour-log.model';
import { TourLogFacade } from '../../../../core/facades/tourlog.facade';
import { NgClass } from '@angular/common';
import { formatDuration } from '../../../../shared/functions/formatter';
import { TourLogItem } from '../tour-log-item/tour-log-item';
import { TourLogModal } from '../tour-log-modal/tour-log-modal';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tour-details',
  imports: [NgClass, TourLogModal],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  private tourLogFacade: TourLogFacade = inject(TourLogFacade);
  private tourFacade: TourFacade = inject(TourFacade);

  activeTour: Signal<Tour | null> = this.tourFacade.selectedTour;
  activeTourLog: TourLog | null = null;

  tourLogs: Signal<TourLog[]> = this.tourLogFacade.tourLogs;

  displayAmount: number = 2;
  currentDisplayPageIndex: number = 1;
  selectedTourLogIndex: number | null = null;

  TourLogUpdater = effect(() => {
    if (this.activeTour()) {
      this.loadData();
    }
    this.activeTourLog = null;
    this.selectedTourLogIndex = null;
    this.currentDisplayPageIndex = 1;
    this.searchSubject.next('');
  });

  loadData() {
    this.tourLogFacade.loadTourLogs(
      this.activeTour()?.tourId!,
      this.currentDisplayPageIndex,
      this.displayAmount,
    );
    this.tourLogFacade.loadTourLogsAmount(this.activeTour()?.tourId!);
  }

  get tourLogsAmount(): number {
    return this.tourLogFacade.toursLogsAmount();
  }
  get hasPrevious(): boolean {
    if (this.tourLogsAmount === 0) return false;
    return this.currentDisplayPageIndex - this.displayAmount >= 1;
  }
  previousGroup(): void {
    if (this.hasPrevious) {
      this.currentDisplayPageIndex -= this.displayAmount;
      this.fetchCurrentBatch();
    }
  }
  get hasNext(): boolean {
    if (this.tourLogsAmount === 0) return false;
    return this.currentDisplayPageIndex + this.displayAmount <= this.tourLogsAmount;
  }

  nextGroup(): void {
    if (this.hasNext) {
      this.currentDisplayPageIndex += this.displayAmount;
      this.fetchCurrentBatch();
    }
  }

  get visibleTourLogArray(): number[] {
    const visible: number[] = [];
    if (this.tourLogs().length === 0) return visible;

    const end = Math.min(this.currentDisplayPageIndex + this.displayAmount, this.tourLogsAmount);
    if (this.hasNext) {
      for (let i = this.currentDisplayPageIndex; i < end; i++) {
        visible.push(i);
      }
    } else {
      for (let i = this.currentDisplayPageIndex; i < end + 1; i++) {
        visible.push(i);
      }
    }

    return visible;
  }

  fetchCurrentBatch(): void {
    const skip = this.currentDisplayPageIndex - 1;
    if (this.activeTour()) {
      this.tourLogFacade.loadTourLogs(this.activeTour()!.tourId, skip, this.displayAmount);
    }

    this.activeTourLog = null;
    this.selectedTourLogIndex = null;
  }

  selectTourLog(index: number): void {
    console.log('selectTourLog', index);

    this.selectedTourLogIndex = index + this.displayAmount * this.currentPage();
    this.activeTourLog = this.tourLogs()[this.selectedTourLogIndex];
    const localIndex = this.selectedTourLogIndex - this.currentDisplayPageIndex;

    this.activeTourLog = this.tourLogFacade.tourLogs()[localIndex];
  }

  currentPage(): number {
    return Math.floor(this.currentDisplayPageIndex / this.displayAmount);
  }

  protected readonly formatDuration = formatDuration;

  modalTourLog!: TourLog | null;

  openModal(index: number | null | undefined) {
    if (index === null || index === undefined) {
      this.modalTourLog = {
        tourLogId: '',
        tourId: this.activeTour()!.tourId,
        date: '',
        comment: '',
        difficulty: 0,
        distance: 0,
        duration: 0,
        rating: 0,
      };
    } else this.modalTourLog = this.tourLogFacade.tourLogs()[index - 1];
  }

  closeModal() {
    this.modalTourLog = null;
  }

  saveTourChanges(updatedTourLog: TourLog) {
    this.activeTourLog = updatedTourLog;
    if (updatedTourLog.tourLogId === '')
      this.tourLogFacade.addTourLog(updatedTourLog);
    else
      this.tourLogFacade.updateTourLog(updatedTourLog);
    this.loadData();
    this.visibleTourLogArray;
    this.closeModal();
  }

  deleteData(toDeleteTourLog: TourLog) {
    if (
      this.selectedTourLogIndex === this.tourLogsAmount &&
      this.selectedTourLogIndex % this.tourLogsAmount === 1
    )
      this.previousGroup();
    this.tourLogFacade.deleteTourLog(toDeleteTourLog.tourLogId);
    this.closeModal();
  }

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchTerm) => {
        this.tourLogFacade.filterTourLogs(searchTerm);
      });
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
    this.activeTourLog = null;
    this.selectedTourLogIndex = null;
    this.loadData();
    this.visibleTourLogArray;
    console.log(this.tourLogs())
  }
}
