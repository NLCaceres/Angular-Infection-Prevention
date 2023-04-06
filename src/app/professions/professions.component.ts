import { Component, OnInit } from "@angular/core";
import { Profession } from "../Profession";
import { ProfessionService } from "../profession.service";

@Component({
  selector: "profession-list",
  templateUrl: "./professions.component.html",
  styleUrls: ["./professions.component.scss"]
})
export class ProfessionsComponent implements OnInit { //? Just like Java or Swift
  viewWidth = 1024;
  professions: Profession[] = []; //? Visible to the HTML template
  constructor(private professionService: ProfessionService) {}

  ngOnInit() {
    this.viewWidth = window.innerWidth;
    this.getProfession();
  }

  getProfession(): void { //? Since I'm dealing with an observable, must subscribe and handle the awaited result
    this.professionService.getAllProfessions().subscribe(professions => {
      this.professions = professions;
    });
  }
}
