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
export class OperationFormComponent implements OnInit {
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

    this.wardService.loadWards(); // Load initial wards
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
          if (error.error.error === 'Ward is double booked') {
            this.alertMessage =
              'The selected ward is already booked for the chosen time. Please select a different time.';
          } else if (
            error.error.error ===
            'Operation duration must be at least 30 minutes'
          ) {
            this.alertMessage =
              'Operation duration must be at least 30 minutes.';
          } else {
            this.alertMessage = 'Error scheduling operation';
          }
        } else {
          console.error('Error scheduling operation', error);
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
