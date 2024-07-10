import { Component, ViewChild } from '@angular/core';
import { OperationListComponent } from './operation-list/operation-list.component';
import { WardListComponent } from './ward-list/ward-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Hospital Booking System';

  @ViewChild(OperationListComponent) operationList!: OperationListComponent;
  @ViewChild(WardListComponent) wardList!: WardListComponent;

  onOperationScheduled() {
    this.operationList.loadOperations();
  }

  onWardAdded() {
    this.wardList.loadWards();
  }
}
