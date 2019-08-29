import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfessionDetailComponent } from "./profession-detail.component";

describe("ProfessionDetailComponent", () => {
  let component: ProfessionDetailComponent;
  let fixture: ComponentFixture<ProfessionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessionDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
