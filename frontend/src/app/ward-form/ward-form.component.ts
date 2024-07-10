import { Component, EventEmitter, Output } from '@angular/core';
import { WardService } from '../services/ward.service';

@Component({
  selector: 'app-ward-form',
  templateUrl: './ward-form.component.html',
  styleUrls: ['./ward-form.component.css'],
})
export class WardFormComponent {
  @Output() wardAdded = new EventEmitter<void>();

  wardName: string = '';

  constructor(private wardService: WardService) {}

  addWard(): void {
    this.wardService.addWard(this.wardName).subscribe(
      (response) => {
        console.log('Ward added successfully!', response);
        this.clearForm();
        this.wardService.loadWards();
        this.wardAdded.emit();
      },
      (error) => {
        console.error('Error adding ward', error);
      }
    );
  }

  clearForm(): void {
    this.wardName = '';
  }
}
