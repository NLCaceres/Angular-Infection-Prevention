import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ProfessionService } from 'app/profession.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let serviceSpy: jasmine.SpyObj<ProfessionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, //? Enables routerLink props w/out requiring any injections
        FormsModule, NgbTypeaheadModule ], //? NgbTypeahead declares relevant components for testing  
      declarations: [ SidebarComponent ],
      providers: [ { provide: ProfessionService, useValue: jasmine.createSpyObj('ProfessionService', ['searchProfessions']) } ],
      
    }).compileComponents();
    
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

    serviceSpy = TestBed.inject(ProfessionService) as jasmine.SpyObj<ProfessionService>;

    fixture.detectChanges();
  });

  it('should create a sidebar component', () => {
    expect(component).toBeTruthy(); //* Tough to say if toBeDefined() or toBeTruthy() is better
    expect(serviceSpy).toBeDefined(); //* Truthy would probably only ever fail if the value had to be 0 or false
  });
  it('should format the profession occupation and discipline into a readable string', () => {
    const professionName = component.formatter({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    expect(professionName).toBe('Foobar Barfoo');
  })
  it('should use any search terms input to make filtered requests from the server', fakeAsync(() => {
    serviceSpy.searchProfessions.and.returnValues(
      of([{ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo'}]), 
      of([{ observedOccupation: 'Fizz', serviceDiscipline: 'Buzz'}, { observedOccupation: 'Faz', serviceDiscipline: 'Baz' }]),
    );
    component.search(of('foobar')).subscribe(list => {
      expect(list).toEqual([{ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }]);
    });

    const inputElem: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElem.value = 'barfoo';
    inputElem.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(350); //* Must elapse the debounce period to ensure ngb-highlight list appears under searchbar

    expect(fixture.debugElement.queryAll(By.css('ngb-highlight'))).toHaveSize(2);
    flush(); //* Must clear async tasks to pass test
  }))
});
