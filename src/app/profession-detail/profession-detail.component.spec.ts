import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfessionDetailComponent } from './profession-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfessionService } from 'app/profession.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Profession } from 'app/Profession';
import { FormsModule } from '@angular/forms';

describe('ProfessionDetailComponent', () => {
  let component: ProfessionDetailComponent;
  let fixture: ComponentFixture<ProfessionDetailComponent>;
  let serviceSpy: jasmine.SpyObj<ProfessionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule ],
      declarations: [ ProfessionDetailComponent ],
      providers: [
        { provide: ProfessionService, useValue: jasmine.createSpyObj('ProfessionService', ['getProfession', 'updateProfession', 'deleteProfession']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } }} } 
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ProfessionDetailComponent);
    component = fixture.componentInstance;
    
    serviceSpy = TestBed.inject(ProfessionService) as jasmine.SpyObj<ProfessionService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the Profession Detail page', () => {
    serviceSpy.getProfession.and.returnValue(of({ observedOccupation: 'Clinic', serviceDiscipline: 'Doctor' }));
    fixture.detectChanges(); //* Start up the component, running ngOnInit()
    expect(component).toBeTruthy();
    expect(routerSpy).toBeTruthy();
    expect(serviceSpy).toBeTruthy();
  });
  it('should run router.navigate() after the back button is clicked', () => {
    serviceSpy.getProfession.and.returnValue(of({ observedOccupation: 'Clinic', serviceDiscipline: 'Doctor' }));
    fixture.detectChanges();
    
    const backButton = fixture.debugElement.query(By.css('.container > button'));
    backButton.triggerEventHandler('click');
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['professions']);
  })
  it('should fetch the profession on init', fakeAsync(() => {
    serviceSpy.getProfession.and.returnValue(of({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }));
    fixture.detectChanges();
    tick();

    const header = fixture.debugElement.query(By.css('div > h2')).nativeElement;
    //? Angular's templates sometimes add whitespace to textContent (even if it doesn't render in prod that way) so trim() helps for comparisons
    expect(header.textContent.trim()).toBe('Would you like to edit this Profession?: Foobar Barfoo');

    const occupationInput: HTMLInputElement = fixture.debugElement.query(By.css('input[placeholder~="Occupation"]')).nativeElement;
    const disciplineInput: HTMLInputElement = fixture.debugElement.query(By.css('input[placeholder~="Discipline"]')).nativeElement;
    expect(occupationInput.value).toBe('Foobar');
    expect(disciplineInput.value).toBe('Barfoo');
  }))
  it('should render an error message if no profession is fetched', () => {
    const returnVal: any = undefined; //* Casting 'undefined' to 'any' or 'unknown' lets me to cast it to Profession below
    serviceSpy.getProfession.and.returnValue(of(returnVal as Profession)); //* So I can imitate the professionService error handler returning undefined
    fixture.detectChanges();

    const errorHeader = fixture.debugElement.query(By.css('div > h3')).nativeElement;
    expect(errorHeader.textContent).toBe('Unable to retrieve the proper profession');
  })
  it('should call updateProfession() and router.navigate() after pressing the update button', fakeAsync(() => {
    serviceSpy.getProfession.and.returnValue(of({ observedOccupation: 'Clinic', serviceDiscipline: 'Doctor' }));
    //* If updateProfession()'s returnVal of() stream is empty, the component's subscribe() would never run WHICH
    serviceSpy.updateProfession.and.returnValue(of({ })); //* fails the test since router.navigate() inside wouldn't be run
    fixture.detectChanges();
    tick();

    const occupationInput: HTMLInputElement = fixture.debugElement.query(By.css('input[placeholder~="Occupation"]')).nativeElement;
    const disciplineInput: HTMLInputElement = fixture.debugElement.query(By.css('input[placeholder~="Discipline"]')).nativeElement;
    occupationInput.value = 'Hospital';
    disciplineInput.value = 'Nurse';
    //* Since a '.value' update occurs from view/template side, need to dispatch an event so ngModel can update the component side
    occupationInput.dispatchEvent(new Event('input')); //* Specifically an 'input' event!
    disciplineInput.dispatchEvent(new Event('input'));

    fixture.debugElement.query(By.css('span > button.btn.btn-warning')).triggerEventHandler('click');
    expect(serviceSpy.updateProfession).toHaveBeenCalledOnceWith('1', { observedOccupation: 'Hospital', serviceDiscipline: 'Nurse' });
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['professions']);
  }))
  it('should call delete() and router.navigate() after pressing the delete button', fakeAsync(() => {
    serviceSpy.getProfession.and.returnValue(of({ observedOccupation: 'Clinic', serviceDiscipline: 'Doctor' }));
    serviceSpy.deleteProfession.and.returnValue(of({ observedOccupation: 'Clinic', serviceDiscipline: 'Doctor' }));
    fixture.detectChanges();
    tick();

    fixture.debugElement.query(By.css('span > button.btn.btn-danger')).triggerEventHandler('click');
    expect(serviceSpy.deleteProfession).toHaveBeenCalledOnceWith('1');
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['professions']);
  }))
});
