import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatProgressBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { WatsonComponent } from './watson/watson.component';
import { MessageService } from './message/message.service';
import { WatsonService } from './watson/watson.service';
import { MessageComponent } from './message/message.component';
import { AppRoutingModule } from './/app-routing.module';

@NgModule({
  declarations: [AppComponent, WatsonComponent, MessageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressBarModule,
    AppRoutingModule
  ],
  providers: [WatsonService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
