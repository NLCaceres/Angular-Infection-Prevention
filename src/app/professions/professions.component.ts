import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { Profession } from "../Profession";
import { ProfessionService } from "../profession.service";
import { debounceTime, fromEvent, Subscription } from "rxjs";

@Component({
  selector: "profession-list",
  templateUrl: "./professions.component.html",
  styleUrls: ["./professions.component.scss"]
})
export class ProfessionsComponent implements OnInit, OnDestroy { //? Just like Java or Swift
  professionService = inject(ProfessionService); //? Easy, super readable alternative to constructor injection
  professions: Profession[] = []; //? Visible to the HTML template
  resizeSubscription$!: Subscription; //? Using '!' and not '?' guarantees this optional property will be set before usage
  viewWidth = 1024;

  //! Lifecycle methods
  ngOnInit() {
    this.viewWidth = window.innerWidth;
    this.resizeSubscription$ = fromEvent(window, "resize").pipe(debounceTime(300)).subscribe(event => {
      this.viewWidth = (event.target as Window).innerWidth;
    });
    this.getProfessions();
  }
  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  private getProfessions(): void { //? Since I'm dealing with an observable, must subscribe and handle the awaited result
    this.professionService.getAllProfessions().subscribe(professions => {
      this.professions = professions;
    });
  }
}
