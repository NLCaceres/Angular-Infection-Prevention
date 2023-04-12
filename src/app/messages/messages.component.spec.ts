import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { MessageService } from 'app/message.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let service: MessageService;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => { //? Could use waitForAsync BUT then setup would have to be divided into 2 beforeEach calls
    await TestBed.configureTestingModule({ 
      declarations: [ MessagesComponent ], //? Declarations are the unit-tested component
      providers: [ MessageService ], //? Could use a jasmineSpy on messageService BUT no need since the component just subscribes to the observable
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents(); //? Ensures the component test works in non-CLI environment, loading in external files like templates & styles
    //* For an example of a jasmineSpy'd messageService, see "profession.service.spec.ts"

    fixture = TestBed.createComponent(MessagesComponent); //* Create the component
    component = fixture.componentInstance; //* Grab a reference to the component class instance
    //* THEN inject services
    service = TestBed.inject(MessageService); //? THIS ONLY WORKS BECAUSE MessageService is injected at the root level!
    //? LASTLY, ensure the component loads the full DOM in
    fixture.detectChanges(); //? This func can be reused to load in future changes
  });

  it('should create an App-wide Messages Alert', () => {
    expect(component).toBeTruthy();
    expect(service).toBeTruthy(); //* Service should be injected too
  });
  it('should hide on start and show only when it has a message', () => {
    const alertParent = fixture.debugElement.query(By.css('.app-message__alert'));
    expect(alertParent).toBeTruthy();
    expect(alertParent.children.length).toBe(0); //* No alert message element

    component.message = " ";
    fixture.detectChanges();
    //? The following query SHOULD return the exact same element found in the alertParent var BUT just in case query again
    const refreshedParent = fixture.debugElement.query(By.css('.app-message__alert'));
    expect(refreshedParent).toBeTruthy();
    expect(refreshedParent.children.length).toBe(0);

    component.message = "Hello world!";
    fixture.detectChanges();
    expect(refreshedParent).toBeTruthy(); //? Following is proof refreshedParent remains the same but now with a newly rendered child -> 'ngb-alert'
    expect(refreshedParent.children.length).toBe(1); //? NativeElement doesn't always work due to its dependency on the browser
    expect(refreshedParent.children[0].nativeElement.textContent.trim()).toBe("Hello world!"); //? So this 1 line may be a bit finicky
  })
});
