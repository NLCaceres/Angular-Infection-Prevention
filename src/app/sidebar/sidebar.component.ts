import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Profession } from "../Profession";
import { ProfessionService } from "../profession.service";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  // ! Wondering why the $? Convention to denote observable
  public professions: Profession;
  private searchTerm = new Subject<string>();

  constructor(private professionService: ProfessionService) {}

  ngOnInit() {}

  search = (searchTerm: Subject<string>) =>
    searchTerm.pipe(
      debounceTime(300), // ! Wait 300 ms after each keystroke before considering a term
      distinctUntilChanged(), // ! Ignore new term if same as previous term
      switchMap((term: string) =>
        this.professionService.searchProfessions(term)
      ) // ! Switch to new observable each time the term changes
      // ! Switch Map preserves order of requests (since they might come back in a different order)
      // ! Cancelling previous searches will not cancel http requests.
      // ! HTTP results are discarded once they reach
    );
  formatter = (profession: Profession) => {
    return `${profession.observed_occupation} ${profession.service_discipline}`;
  };
}
