import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WardService } from '../services/ward.service';

@Component({
  selector: 'app-ward-list',
  templateUrl: './ward-list.component.html',
  styleUrls: ['./ward-list.component.css'],
})
export class WardListComponent implements OnInit {
  wards: any[] = [];
  errorMessage: string = '';

  @Output() wardModified = new EventEmitter<void>();

  constructor(private wardService: WardService) {}

  ngOnInit(): void {
    this.loadWards();
  }

  loadWards(): void {
    this.wardService.getWards().subscribe(
      (data) => {
        this.wards = data.map((ward) => ({ ...ward, editMode: false }));
      },
      (error) => {
        console.error('Error fetching wards', error);
      }
    );
  }

  deleteWard(id: number): void {
    this.wardService.deleteWard(id).subscribe(
      () => {
        this.wards = this.wards.filter((ward) => ward.id !== id);
        this.errorMessage = '';
        this.wardModified.emit();
      },
      (error) => {
        if (error.status === 400 && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          console.error('Error deleting ward', error);
        }
      }
    );
  }

  updateWard(ward: any): void {
    if (ward.name.trim() === '') {
      this.errorMessage = 'Ward name cannot be empty';
      return;
    }
    this.wardService.updateWard({ id: ward.id, name: ward.name }).subscribe(
      () => {
        ward.editMode = false;
        this.errorMessage = '';
        this.wardModified.emit();
      },
      (error) => {
        if (error.status === 400 && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          console.error('Error updating ward', error);
        }
      }
    );
  }
}
