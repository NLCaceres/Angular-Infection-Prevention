import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionService } from '../profession.service';
import type { Profession } from '../Profession';

@Component({
  selector: 'profession-detail',
  templateUrl: './profession-detail.component.html',
  styleUrls: ['./profession-detail.component.scss']
})
export class ProfessionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute); //? Used to check the URL params i.e. 'ID' in this component
  private router = inject(Router);
  private professionService = inject(ProfessionService);

  profession: Profession = { observedOccupation: 'Clinic', serviceDiscipline: 'Doctor' };
  errorOccurred: boolean = false;

  ngOnInit(): void { //? Use this lifecycle method for loading data. Let inject() set class properties above
    this.getProfession();
  } //? If data directives involved, then use ngOnChanges (which is called before ngOnInit)

  getProfession(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    //? W/out subscribe, service will not make a request. W/out its callback, nothing will happen with the returned data
    this.professionService.getProfession(id).subscribe(profession => {
      if (profession) { this.profession = profession }
      else { this.errorOccurred = true }
    });
  }
  update(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.professionService
      .updateProfession(id, this.profession)
      .subscribe(() => this.navToProfessionsList());
  }
  delete(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.professionService.deleteProfession(id).subscribe(() => this.navToProfessionsList());
  }

  navToProfessionsList(): void {
    this.router.navigate(['professions']);
  }
}
