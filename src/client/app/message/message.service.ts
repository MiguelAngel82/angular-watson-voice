import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class MessageService {
  private url = 'http://localhost:3005';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  // getMessage(): Observable<any> {
  //   return Observable.create((observer) => {
  //     this.socket.on('new-message', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  public getMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

}
