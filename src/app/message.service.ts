import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root" // ! No need to put this messageService in provider array
})
export class MessageService {
  messages: string[] = [];

  _message = new Subject<string>();

  message: string;

  constructor() {}

  // add(message: Subject<string>) {
  //   this.message = message;
  // }

  close(message: string) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }

  clear() {
    this.messages = [];
  }
}
