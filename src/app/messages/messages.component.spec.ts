import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MessagesComponent } from "./messages.component";
import { MessageService } from "app/services/message.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("MessagesComponent", () => {
  let component: MessagesComponent;
  let service: MessageService;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => { // ?: Before `async`, Ang used `waitForAsync` in its own `beforeEach()`
    await TestBed.configureTestingModule({ // ?: to run this configuration
      declarations: [ MessagesComponent ], // ?: `Declarations` contains the component under test
      providers: [ MessageService ], // - No need to mock since the component just observes it
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents(); // ?: Loads templates, styles, etc so tests work if not using `ng test`

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance; // - Grab the component init
    // - Inject any dependencies
    service = TestBed.inject(MessageService); // ?: WORKS since MessageService is injected at root
    // - Use `detectChanges` to fully load the DOM before the test starts
    fixture.detectChanges(); // ?: Can also be used to update the DOM after changes in tests
  });

  it("should create an App-wide Messages Alert", () => {
    expect(component).toBeTruthy();
    expect(service).toBeTruthy(); // - Service should be injected too
  });
  it("should hide on start and show only when it has a message", () => {
    const alertParent = fixture.debugElement.query(By.css(".app-message__alert"));
    expect(alertParent).toBeTruthy();
    expect(alertParent.children.length).toBe(0); // - Starts without alert message element

    component.message = " "; // - WHEN message sent is empty
    fixture.detectChanges();
    // ?: This query SHOULD get the same element as `alertParent` above BUT just in case query again
    const refreshedParent = fixture.debugElement.query(By.css(".app-message__alert"));
    expect(refreshedParent).toBeTruthy();
    expect(refreshedParent.children.length).toBe(0); // - THEN nothing new is rendered

    component.message = "Hello world!"; // - WHEN an actual message is sent
    fixture.detectChanges();
    // ?: Following shows `refreshedParent` actually re-renders/updates after `detectChanges()`
    expect(refreshedParent).toBeTruthy(); // ?: SO extra queries probably never needed
    expect(refreshedParent.children.length).toBe(1); // - THEN an alert message is rendered
    // ?: `.nativeElement` can be flakey since its props vary based on the runtime env
    expect(refreshedParent.children[0].nativeElement.textContent.trim()).toBe("Hello world!");
  });
});
