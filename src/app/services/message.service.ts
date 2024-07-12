import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root" // ?: No need to put this messageService in provider array
})
export class MessageService {
  message$ = new Subject<string>();

  send(message: string) {
    this.message$.next(message);
  }
}
