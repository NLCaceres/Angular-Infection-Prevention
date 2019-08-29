import { Component, OnInit } from "@angular/core";
import { Profession } from "../Profession";
import { ProfessionService } from "../profession.service";
import { Observable } from "rxjs";

@Component({
  selector: "profession-list",
  templateUrl: "./professions.component.html",
  styleUrls: ["./professions.component.scss"]
})
export class ProfessionsComponent implements OnInit {
  // ! This is very much like Java or swift
  // ! declare as many class vars as you want. Type inference will help
  // ! From here you can use it in your template as normal
  professions: Profession[];
  constructor(private professionService: ProfessionService) {}

  ngOnInit() {
    this.getProfession();
  }

  getProfession(): void {
    // ! If this was from some file (or constant) then it would be a simple assignment
    // ! Since it is coming from the http module (returning an observable)
    // ! it is an async request, so the observable waits for a response from the server
    // ! and gives a real value once it arrives, assigning as expected once it does
    this.professionService.getAllProfessions().subscribe(professions => {
      this.professions = professions;
      console.log(professions);
    });
  }
}
