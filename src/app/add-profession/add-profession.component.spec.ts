import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProfessionComponent } from './add-profession.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfessionService } from 'app/profession.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

describe('AddProfessionComponent', () => {
  let component: AddProfessionComponent;
  let fixture: ComponentFixture<AddProfessionComponent>;
  let serviceSpy: jasmine.SpyObj<ProfessionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AddProfessionComponent ],
      providers: [ 
        { provide: ProfessionService, useValue: jasmine.createSpyObj('ProfessionService', ['addProfession']) }, 
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AddProfessionComponent);
    component = fixture.componentInstance;

    serviceSpy = TestBed.inject(ProfessionService) as jasmine.SpyObj<ProfessionService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create an "add-profession" page', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy).toBeTruthy();
    expect(routerSpy).toBeTruthy();
  });
  it('should run router.navigate() after back-button is clicked', () => {
    const backButton = fixture.debugElement.query(By.css('.container > button'));
    backButton.triggerEventHandler('click');
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['professions']);
  })
  describe('should run add() after the submit button is clicked', () => {
    it('clears text after submission', () => {
      serviceSpy.addProfession.and.returnValue(new Observable()); //* Simple stub to prevent an undefined return and subscribe()
      const submitButton = fixture.debugElement.query(By.css('.form__submit-button'));
      const occupationInput = fixture.debugElement.query(By.css('input[placeholder~="Occupation"]')).nativeElement;
      const disciplineInput = fixture.debugElement.query(By.css('input[placeholder~="Discipline"]')).nativeElement;

      occupationInput.value = 'Foobar'; //* Insert text into occupation input
      disciplineInput.value = 'Barfoo'; //* Insert text into discipline input

      submitButton.triggerEventHandler('click');

      expect(occupationInput.textContent).toBe(''); //* Submission done, both inputs made empty before navigate() is called
      expect(disciplineInput.textContent).toBe('');
    })
    it('must have valid data passed in to call addProfession()', () => {
      serviceSpy.addProfession.and.returnValue(new Observable());
      const submitButton = fixture.debugElement.query(By.css('.form__submit-button'));
      const occupationInput = fixture.debugElement.query(By.css('input[placeholder~="Occupation"]')).nativeElement;
      const disciplineInput = fixture.debugElement.query(By.css('input[placeholder~="Discipline"]')).nativeElement;

      submitButton.triggerEventHandler('click');
      expect(serviceSpy.addProfession).toHaveBeenCalledTimes(0);

      occupationInput.value = 'Foobar'; //* Insert text into input
      disciplineInput.value = 'Barfoo';
      
      submitButton.triggerEventHandler('click');
      expect(serviceSpy.addProfession).toHaveBeenCalledTimes(1);
    })
    it('will run router.navigate() upon successful submission', () => {
      serviceSpy.addProfession.and.returnValue(new Observable());
      const submitButton = fixture.debugElement.query(By.css('.form__submit-button'));
      const occupationInput = fixture.debugElement.query(By.css('input[placeholder~="Occupation"]')).nativeElement;
      const disciplineInput = fixture.debugElement.query(By.css('input[placeholder~="Discipline"]')).nativeElement;

      submitButton.triggerEventHandler('click'); //* Submitting without any data is invalid!
      expect(routerSpy.navigate).toHaveBeenCalledTimes(0); //* So no back() called

      occupationInput.value = 'Foobar'; //* Insert text into input
      disciplineInput.value = 'Barfoo';

      submitButton.triggerEventHandler('click');
      setTimeout(() => { //* Briefly wait for subscription to run router.navigate()
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['professions']);
      }, 100);
    })
  })
});
