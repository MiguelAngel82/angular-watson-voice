import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessageComponent} from './message/message.component';
import {RouterModule, Routes} from '@angular/router';
import {WatsonComponent} from './watson/watson.component';

const routes: Routes = [
  { path: 'message', component: MessageComponent },
  { path: 'watson', component: WatsonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
