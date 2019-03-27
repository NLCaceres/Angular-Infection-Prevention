import { Component, OnInit } from "@angular/core";
import { MessageService } from "../message.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit {
  // ! Made it public to bind it to template
  // ! Angular only binds to public components (not sure what that means)
  constructor(public messageService: MessageService) {}

  ngOnInit() {
    this.messageService._message.subscribe(
      message => (this.messageService.message = message)
    );
    this.messageService._message
      .pipe(debounceTime(5000))
      .subscribe(() => (this.messageService.message = null));
  }
}
