import { Component, OnInit } from '@angular/core';
import { WardService } from '../services/ward.service';

@Component({
  selector: 'app-ward-list',
  templateUrl: './ward-list.component.html',
  styleUrls: ['./ward-list.component.css'],
})
export class WardListComponent implements OnInit {
  wards: any[] = [];
  errorMessage: string = '';

  constructor(private wardService: WardService) {}

  ngOnInit(): void {
    this.loadWards();
  }

  loadWards(): void {
    this.wardService.getWards().subscribe(
      (data) => {
        this.wards = data;
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
        this.wardService.refreshWards();
        this.errorMessage = '';
      },
      (error) => {
        if (
          error.status === 400 &&
          error.error.error ===
            'Ward has scheduled operations and cannot be deleted'
        ) {
          this.errorMessage =
            'Cannot delete ward: there are still operations scheduled.';
        } else {
          console.error('Error deleting ward', error);
        }
      }
    );
  }
}
