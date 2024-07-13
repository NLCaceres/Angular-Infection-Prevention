import { Component, OnInit, inject } from "@angular/core";
import { MessageService } from "../services/message.service";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit {
  // ?: MessageService MUST be public, otherwise, the template can't see it
  message: string = "";
  messageService = inject(MessageService);

  ngOnInit() {
    this.messageService.message$.subscribe(message => {
      this.message = message;
      setTimeout(() => { this.message = ""; }, 5000); // - Callback to hide the alert
    });
  }
}
