import { Component, inject } from '@angular/core';
import { ProfessionService } from '../profession.service';
import { Router } from '@angular/router';

@Component({
  selector: 'add-profession',
  templateUrl: './add-profession.component.html',
  styleUrls: ['./add-profession.component.scss']
})
export class AddProfessionComponent {
  private professionService = inject(ProfessionService);
  private router = inject(Router);

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
      .subscribe(() => this.navToProfessionList());
  }

  navToProfessionList() { //? navigate() adds to history w/ path based on base URL i.e. localhost:1234/professions
    this.router.navigate(['professions']); //? No leading slash needed for items in the url commands array
  } //? Its usage is like the [routerLink] directive used in templates' <a> and <button> elements
}
