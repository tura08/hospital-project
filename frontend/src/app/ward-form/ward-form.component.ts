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

  constructor(private wardService: WardService) {}

  ngOnInit(): void {
    if (this.ward) {
      this.wardName = this.ward.name;
    }
  }

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
