import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ProfessionService } from "../profession.service";
import { Profession } from "../Profession";

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
    // * The following is a small attempt at form validation
    observedOccupation = observedOccupation.trim();
    serviceDiscipline = serviceDiscipline.trim();
    if (!observedOccupation || !serviceDiscipline) {
      return;
    }
    const newProfession = new Profession(observedOccupation, serviceDiscipline);
    this.professionService
      .addProfession(newProfession)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
