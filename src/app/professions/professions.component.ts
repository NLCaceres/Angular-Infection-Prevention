import { Component, OnInit, OnDestroy } from "@angular/core";
import { Profession } from "../Profession";
import { ProfessionService } from "../profession.service";
import { debounceTime, fromEvent, Subscription } from "rxjs";

@Component({
  selector: "profession-list",
  templateUrl: "./professions.component.html",
  styleUrls: ["./professions.component.scss"]
})
export class ProfessionsComponent implements OnInit, OnDestroy { //? Just like Java or Swift
  viewWidth = 1024;
  professions: Profession[] = []; //? Visible to the HTML template
  resizeSubscription$?: Subscription
  constructor(private professionService: ProfessionService) {}

  //! Lifecycle methods
  ngOnInit() {
    this.viewWidth = window.innerWidth;
    this.resizeSubscription$ = fromEvent(window, 'resize').pipe(debounceTime(300)).subscribe(event => {
      this.viewWidth = (event.target as Window).innerWidth;
    })
    this.getProfession();
  }
  ngOnDestroy() {
    this.resizeSubscription$?.unsubscribe()
  }

  getProfession(): void { //? Since I'm dealing with an observable, must subscribe and handle the awaited result
    this.professionService.getAllProfessions().subscribe(professions => {
      this.professions = professions;
    });
  }
}
