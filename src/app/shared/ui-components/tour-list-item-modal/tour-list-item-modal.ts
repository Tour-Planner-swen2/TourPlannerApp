import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  viewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TourDto, TourResponseDto } from '../../../core/dtos/tour.dto';
import { TravelType } from '../../../core/models/travel-types.model';
import { NgClass } from '@angular/common';
import { initTooltips } from 'flowbite';
import { formatDuration } from '../../functions/formatter';
import { TourFileService } from '../../../core/services/tour-file.service';
import { TourLogFacade } from '../../../core/facades/tourlog.facade';
import { TourLog } from '../../../core/models/tour-log.model';

@Component({
  selector: 'app-tour-list-item-modal',
  imports: [FormsModule, NgClass],
  templateUrl: './tour-list-item-modal.html',
  styleUrl: './tour-list-item-modal.css',
})
export class TourListItemModal {
  isEditing: InputSignal<boolean> = input.required<boolean>();
  tour: InputSignal<TourDto | null> = input.required<TourDto | null>();
  tourId: InputSignal<string | null> = input<string | null>(null);
  onCancel: OutputEmitterRef<void> = output<void>();
  onSave: OutputEmitterRef<TourDto> = output<TourDto>();
  onSaveWithLogs: OutputEmitterRef<{ tour: TourDto; tourLogs: TourLog[] | null }> = output<{
    tour: TourDto;
    tourLogs: TourLog[] | null;
  }>();
  onDelete: OutputEmitterRef<TourResponseDto> = output<TourResponseDto>();

  private tourFileService = inject(TourFileService);
  private tourLogFacade = inject(TourLogFacade);

  fileInput = viewChild<ElementRef>('fileInput');

  travelTypeOptions: TravelType[] = [
    TravelType.Bike,
    TravelType.Hike,
    TravelType.Run,
    TravelType.Car,
  ];

  importedTourLogs: TourLog[] | null = null;

  selectTravelType(travelType: TravelType) {
    this.editableTour.route.travelType = travelType;
  }

  editableTour!: TourDto;

  ngOnInit() {
    if (this.tour()) {
      this.editableTour = structuredClone(this.tour()!);
    }
  }

  ngAfterViewInit(): void {
    initTooltips();
  }

  clickCancel() {
    this.importedTourLogs = null;
    this.onCancel.emit();
  }

  clickDelete() {
    if (!this.tourId()) {
      console.error('Cannot delete: Tour ID is missing.');
      return;
    }

    const tourToDelete = {
      ...this.editableTour,
      tourId: this.tourId()
    } as TourResponseDto;

    this.onDelete.emit(tourToDelete);
  }

  clickDone() {
    if (this.DataCorrect()) {
      if (this.importedTourLogs !== null) {
        this.onSaveWithLogs.emit({
          tour: this.editableTour,
          tourLogs: this.importedTourLogs,
        });
      } else {
        this.onSave.emit(this.editableTour);
      }
      this.importedTourLogs = null;
    }
  }

  async clickDownload() {
    if (!this.tourId()) {
      alert('Cannot download. Tour ID not available.');
      return;
    }

    this.tourLogFacade.loadTourLogs(this.tourId()!, 1, 1000);

    const tourLogs = this.tourLogFacade.tourLogs();
    this.tourFileService.downloadTour(this.editableTour, tourLogs || null);

    this.onCancel.emit();
  }

  clickUpload() {
    const input = this.fileInput()?.nativeElement as HTMLInputElement;
    input?.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      const importedData = await this.tourFileService.uploadTour(file);

      this.editableTour = {
        ...importedData.tour,
        tourId: undefined,
      };

      const routeData = this.editableTour.route as any;
      if (routeData.traveltype) {
        this.editableTour.route.travelType = routeData.traveltype;
      }

      this.importedTourLogs = importedData.tourLogs || null;

      alert('Tour imported successfully! Please click Done to save.');
    } catch (error) {
      alert(`Error importing tour: ${(error as Error).message}`);
    }

    input.value = '';
  }

  DataCorrect(): boolean {
    if (!this.editableTour.title || this.editableTour.title.trim() === '') {
      alert('Title cannot be empty!');
      return false;
    }

    if (this.editableTour.title.length > 100) {
      alert('Title is too long! Max length is 100 characters.');
      return false;
    }

    if (this.editableTour.description && this.editableTour.description.length > 1000) {
      alert('Description is too long! Max length is 1000 characters.');
      return false;
    }

    if (!this.editableTour.route.start || this.editableTour.route.start.trim() === '') {
      alert('Start location cannot be empty!');
      return false;
    }

    if (!this.editableTour.route.destination || this.editableTour.route.destination.trim() === '') {
      alert('Destination cannot be empty!');
      return false;
    }

    if (this.editableTour.route.start.trim() === this.editableTour.route.destination.trim()) {
      alert('Start and Destination cannot be the same!');
      return false;
    }

    if (!this.editableTour.route.travelType) {
      alert('Please select a valid travel type!');
      return false;
    }

    /*if (this.editableTour.route.information && this.editableTour.route.information.length > 500) {
      alert('Route information is too long! Max length is 500 characters.');
      return false;
    }*/
    return true;
  }

  protected readonly formatDuration = formatDuration;
}
