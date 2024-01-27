import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { MessagesComponent } from "./messages/messages.component";

describe("Base App Component", () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      //* navbar + app-wide messages declared instead of using NO_ERRORS_SCHEMA in case future integration/E2E testing needed
      declarations: [ AppComponent, NavbarComponent, MessagesComponent ]
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
