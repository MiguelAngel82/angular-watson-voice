import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MessageService} from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  message: any;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getMessage()
      .subscribe(message => {
          this.message = message;
        }
      );
  }

}
