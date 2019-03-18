import { Component, NgZone, OnInit } from '@angular/core';

import { WatsonService } from './watson.service';
import { RecognizeStream } from '../core';
import * as recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import {MessageService} from '../message/message.service';

@Component({
  selector: 'app-watson',
  templateUrl: './watson.component.html',
  styleUrls: ['./watson.component.scss']
})
export class WatsonComponent implements OnInit {
  isStreaming: boolean;
  stream: any;
  text: string;
  token: string;

  constructor(private watsonService: WatsonService, private ngZone: NgZone, private messageService: MessageService) {}

  ngOnInit() {
    this.getToken();
  }

  getToken(): void {
    this.watsonService.fetchToken().subscribe(token => (this.token = token));
  }

  setOptions(token: string): RecognizeStream {
    return {
      access_token: token,
      format: true,
      extractResults: true,
      objectMode: true,
      url: 'wss://gateway-lon.watsonplatform.net/speech-to-text/api'
    };
  }

  startStream(): void {
    this.isStreaming = true;
    this.stream = recognizeMicrophone(this.setOptions(this.token));
    this.messageService.sendMessage('Prueba');
    this.ngZone.runOutsideAngular(() => {
      this.stream.on('data', data => {
        this.ngZone.run(() => {
          this.text = data.alternatives[0].transcript;
          this.messageService.sendMessage(this.text);
        });
      });
    });
  }

  stopStream(): void {
    if (this.stream) {
      this.isStreaming = false;
      this.stream.stop();
    }
  }
}
