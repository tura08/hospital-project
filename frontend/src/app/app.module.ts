import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WardFormComponent } from './ward-form/ward-form.component';
import { WardListComponent } from './ward-list/ward-list.component';
import { WardService } from './services/ward.service';
import { OperationFormComponent } from './operation-form/operation-form.component';
import { OperationListComponent } from './operation-list/operation-list.component';

@NgModule({
  declarations: [
    AppComponent,
    WardFormComponent,
    WardListComponent,
    OperationFormComponent,
    OperationListComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [WardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
