import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ProfessionService } from "../profession.service";
import { Profession } from "../Profession";

@Component({
  selector: "profession-detail",
  templateUrl: "./profession-detail.component.html",
  styleUrls: ["./profession-detail.component.scss"]
})
export class ProfessionDetailComponent implements OnInit {
  @Input() profession: Profession;

  constructor(
    private route: ActivatedRoute, // ! Checks URL params (ID being the big one here)
    private professionService: ProfessionService, // ! Usual it makes the req to the server
    private location: Location // ! Interacts with the browser (ensures go back button works as you want it)
  ) {}

  // ! Heavy init logic (anything more than simple local vars being set [so put that in constructor])
  // ! Should go in ngOnInit
  // ! If there's data directives involved, then it should go in ngOnChanges, since that's called before ngOnInit
  ngOnInit(): void {
    this.getProfession();
  }

  // ! None of these will fire an actual request to the server
  // ! UNLESS you subscribe to it at the end
  // ! Observables only listen when they are subscribed to
  // ! Even if you just type subscribe() at the end with no callback
  // ! or params, you will still get it to work, but SUBSCRIBE IS NEEDED
  getProfession(): void {
    // ! Using the "+" here converts this to a number!!!
    // ! All route params are actually strings so no + needed
    const id = this.route.snapshot.paramMap.get("id");
    this.professionService.getProfession(id).subscribe(profession => {
      this.profession = profession;
      console.log(profession);
    });
  }
  update(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.professionService
      .updateProfession(id, this.profession)
      .subscribe(() => this.goBack());
  }
  delete(): void {
    const id = this.profession._id;
    this.professionService.deleteProfession(id).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
