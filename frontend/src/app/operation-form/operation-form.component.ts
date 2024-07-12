import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { OperationService } from '../services/operation.service';
import { WardService } from '../services/ward.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.css'],
})
export class OperationFormComponent implements OnInit, OnDestroy {
  @Output() operationScheduled = new EventEmitter<void>();

  wardId: number = 0;
  patientName: string = '';
  startTime: string = '';
  endTime: string = '';
  wards: any[] = [];
  alertMessage: string = '';
  private wardsSubscription: Subscription | undefined;

  constructor(
    private operationService: OperationService,
    private wardService: WardService
  ) {}

  ngOnInit() {
    this.wardsSubscription = this.wardService.wards$.subscribe(
      (wards) => {
        this.wards = wards;
      },
      (error) => {
        console.error('Error fetching wards', error);
      }
    );

    this.wardService.loadWards();
  }

  ngOnDestroy() {
    if (this.wardsSubscription) {
      this.wardsSubscription.unsubscribe();
    }
  }

  scheduleOperation() {
    const newOperation = {
      ward_id: this.wardId,
      patient_name: this.patientName,
      start_time: this.startTime,
      end_time: this.endTime,
    };

    this.operationService.scheduleOperation(newOperation).subscribe(
      (response) => {
        console.log('Operation scheduled successfully!', response);
        this.clearForm();
        this.alertMessage = '';
        this.operationScheduled.emit();
      },
      (error) => {
        if (error.status === 400) {
          this.alertMessage = error.error.error;
        } else {
          console.error('Error scheduling operation', error);
          this.alertMessage = 'Unexpected error occurred. Please try again.';
        }
      }
    );
  }

  clearForm() {
    this.wardId = 0;
    this.patientName = '';
    this.startTime = '';
    this.endTime = '';
  }
}
