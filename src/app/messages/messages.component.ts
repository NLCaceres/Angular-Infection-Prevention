import { Component, OnInit, inject } from "@angular/core";
import { MessageService } from "../message.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit {
  //? MessageService MUST be public, otherwise, the template can't see it
  messageService = inject(MessageService);

  ngOnInit() {
    this.messageService._message.subscribe(
      message => (this.messageService.message = message)
    );
    this.messageService._message
      .pipe(debounceTime(5000))
      .subscribe(() => (this.messageService.message = undefined));
  }
}
