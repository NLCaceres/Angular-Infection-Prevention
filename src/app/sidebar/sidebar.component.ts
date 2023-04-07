import { Component, inject } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Profession } from "../Profession";
import { ProfessionService } from "../profession.service";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent {
  private professionService = inject(ProfessionService);
  
  public professions: Profession[] = [];

  search = (term$: Observable<string>) => //? Why the "$" suffix? Convention denotes an observable
    term$.pipe(
      debounceTime(300), //? Wait 300 ms after each keystroke before considering a search term
      distinctUntilChanged(), //? Ignore new term if same as previous search term
      switchMap((term: string) => //? switchMap takes in each new observable sent by the service
        this.professionService.searchProfessions(term) //? Preserving order of HTTP Request results emitted by those observables
      ) //? BUT it will not cancel http requests, it simply discards the results
    );
  formatter = (profession: Profession) => {
    return `${profession.observedOccupation} ${profession.serviceDiscipline}`;
  };
}
