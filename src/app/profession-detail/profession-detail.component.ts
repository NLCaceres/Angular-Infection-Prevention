import { Component, OnInit, Input, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ProfessionService } from "../profession.service";
import type { Profession } from "../Profession";

@Component({
  selector: "profession-detail",
  templateUrl: "./profession-detail.component.html",
  styleUrls: ["./profession-detail.component.scss"]
})
export class ProfessionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute); //? Used to check the URL params i.e. "ID" in this component
  private professionService = inject(ProfessionService);
  private location = inject(Location); //? Interacts with the browser -> Used to ensure back button works properly

  @Input() profession: Profession = { observedOccupation: "Clinic", serviceDiscipline: "Doctor" };

  ngOnInit(): void { //? Use this lifecycle method for loading data (let the constructor set simple local vars)
    this.getProfession();
  } //? If data directives involved, then use ngOnChanges (which is called before ngOnInit)

  getProfession(): void {
    const id = this.route.snapshot.paramMap.get("id") ?? "";
    //? W/out subscribe, service will not make a request. W/out its callback, nothing will happen with the returned data
    this.professionService.getProfession(id).subscribe(profession => {
      this.profession = profession;
    });
  }
  update(): void {
    const id = this.route.snapshot.paramMap.get("id") ?? "";
    this.professionService
      .updateProfession(id, this.profession)
      .subscribe(() => this.goBack());
  }
  delete(): void {
    const id = this.profession._id ?? "";
    this.professionService.deleteProfession(id).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
