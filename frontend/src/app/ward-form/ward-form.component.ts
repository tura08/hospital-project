import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { WardService } from '../services/ward.service';

@Component({
  selector: 'app-ward-form',
  templateUrl: './ward-form.component.html',
  styleUrls: ['./ward-form.component.css'],
})
export class WardFormComponent implements OnInit {
  @Output() wardAdded = new EventEmitter<void>();
  @Input() ward: any | null = null;

  wardName: string = '';
  mode: 'add' | 'edit' = 'add';

  constructor(private wardService: WardService) {}

  ngOnInit(): void {
    if (this.ward) {
      this.wardName = this.ward.name;
      this.mode = 'edit';
    }
  }

  saveWard(): void {
    if (this.mode === 'add') {
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
    } else if (this.mode === 'edit') {
      const updatedWard = { id: this.ward.id, name: this.wardName };
      this.wardService.updateWard(updatedWard).subscribe(
        (response) => {
          console.log('Ward updated successfully!', response);
          this.clearForm();
          this.wardService.loadWards();
          this.wardAdded.emit();
        },
        (error) => {
          console.error('Error updating ward', error);
        }
      );
    }
  }

  clearForm(): void {
    this.wardName = '';
    this.mode = 'add';
    this.ward = null;
  }
}
