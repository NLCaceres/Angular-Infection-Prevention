import { Component, inject } from "@angular/core";
import { Observable, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { type Profession } from "../models/Profession";
import { ProfessionService } from "../profession.service";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent {
  private professionService = inject(ProfessionService);

  search = (term$: Observable<string>) => //? The '$' suffix is an Angular convention denoting observables
    term$.pipe(
      debounceTime(300), //? MUST observe a 300 ms pause before considering a search term
      distinctUntilChanged(), //? Ignore new term if same as previous search term
      switchMap((term: string) => { //? switchMap takes in each new observable sent by the service
        return this.professionService.searchProfessions(term); //? Preserving order of HTTP Request results emitted by those observables
      }) //? BUT it will not cancel http requests, it simply discards previous results in favor of the most recent
    );
  formatter = (profession: Profession) => {
    return `${profession.observedOccupation} ${profession.serviceDiscipline}`;
  };
}
