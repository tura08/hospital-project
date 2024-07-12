import { Component, OnInit, ViewChild } from '@angular/core';
import { OperationService } from '../services/operation.service';
import { DatePipe } from '@angular/common';
import { OperationFormComponent } from '../operation-form/operation-form.component';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.css'],
  providers: [DatePipe],
})
export class OperationListComponent implements OnInit {
  operations: any[] = [];
  editingOperation: any | null = null;

  @ViewChild(OperationFormComponent) operationForm!: OperationFormComponent;

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.loadOperations();
    this.operationForm.operationScheduled.subscribe(() => {
      this.loadOperations();
    });
  }

  loadOperations(): void {
    this.operationService.getOperations().subscribe(
      (data) => {
        this.operations = data;
      },
      (error) => {
        console.error('Error fetching operations', error);
      }
    );
  }

  deleteOperation(id: number): void {
    this.operationService.deleteOperation(id).subscribe(
      () => {
        this.operations = this.operations.filter(
          (operation) => operation.id !== id
        );
      },
      (error) => {
        console.error('Error deleting operation', error);
      }
    );
  }
}
