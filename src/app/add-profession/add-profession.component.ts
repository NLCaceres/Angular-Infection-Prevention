import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ProfessionService } from "../profession.service";

@Component({
  selector: "add-profession",
  templateUrl: "./add-profession.component.html",
  styleUrls: ["./add-profession.component.scss"]
})
export class AddProfessionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private professionService: ProfessionService,
    private location: Location
  ) {}

  ngOnInit() {}

  add(observedOccupation: string, serviceDiscipline: string): void {
    //* Sanitize form -> trim off whitespace
    observedOccupation = observedOccupation.trim();
    serviceDiscipline = serviceDiscipline.trim();

    //* Validate result is not undefined or null or empty
    if (!observedOccupation || !serviceDiscipline) {
      return;
    }

    const newProfession = { observedOccupation, serviceDiscipline };
    this.professionService.addProfession(newProfession)
      .subscribe(() => this.goBack()); //todo Is there another way to goBack() w/out altering history?
  }

  goBack(): void {
    this.location.back();
  }
}
