import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProfessionsComponent } from "./professions.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ProfessionService } from "app/profession.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { provideHttpClient, withFetch } from "@angular/common/http";

describe("ProfessionsComponent", () => {
  let component: ProfessionsComponent;
  let fixture: ComponentFixture<ProfessionsComponent>;
  let serviceMock: jest.Mock;

  beforeEach(async () => {
    serviceMock = jest.fn();
    await TestBed.configureTestingModule({
      declarations: [ProfessionsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        { provide: ProfessionService, useValue: { getAllProfessions: serviceMock } },
        provideHttpClient(withFetch()), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionsComponent);
    component = fixture.componentInstance;

    TestBed.inject(ProfessionService);
  });

  it("should create a Profession List Page", () => {
    serviceMock.mockReturnValue(of([{ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }]));
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(serviceMock).toBeTruthy();
  });
  it("should fetch professions and render a Titlecased list item for each on init", () => {
    serviceMock.mockReturnValue(of([
      { observedOccupation: "foobar", serviceDiscipline: "barfoo" }, { observedOccupation: "fizz", serviceDiscipline: "buzz" }
    ]));
    fixture.detectChanges();

    const professionListItems = fixture.debugElement.queryAll(By.css("li"));
    expect(professionListItems.length).toBe(2);

    //* Must burrow down from <li> level -> <a> -> <span> {{ text }} </span>
    const firstProfession: HTMLElement = professionListItems[0].children[0].children[0].nativeElement;
    expect(firstProfession.textContent?.trim()).toBe("Foobar Barfoo");
    const secondProfession: HTMLElement = professionListItems[1].children[0].children[0].nativeElement;
    expect(secondProfession.textContent?.trim()).toBe("Fizz Buzz");
  });
  it("should calculate the viewWidth on init so bigger viewports can get a sidebar", () => {
    serviceMock.mockReturnValue(of([{ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }]));
    fixture.detectChanges();

    //? ViewWidth = 1200 based on default size of the Chrome test result browser that appears while running tests MEANWHILE component default = 1024
    component.viewWidth = 576; //* As a precaution, set the viewWidth anyway
    fixture.detectChanges(); //* And ensure the changes take place
    expect(fixture.debugElement.query(By.css("sidebar"))).toBeDefined();

    component.viewWidth = 575;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("sidebar"))).toBeNull();
  });
  it("should unsubscribe from viewWidth changes on destroy", () => {
    serviceMock.mockReturnValue(of([{ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }]));
    fixture.detectChanges(); //? Important for spyOn to come after detectChanges so the subscription has been init in ngOnInit
    const unsubscribeSpy = jest.spyOn(component.resizeSubscription$, "unsubscribe");

    component.ngOnDestroy(); //* Now unsubscribe to prevent any memory leaks
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});
