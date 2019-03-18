import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MessageService {
  subject: Subject<string> = new Subject<string>();

  sendMessage(message: string) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
