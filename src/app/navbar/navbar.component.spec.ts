import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

describe('Navigation Bar Component', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, NgbCollapseModule ],
      declarations: [ NavbarComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a Navbar component with a title property in its brand', () => {
    expect(component).toBeTruthy();

    const navbarBrand = fixture.debugElement.query(By.css('.navbar-brand'));
    expect(navbarBrand).toBeDefined();
    expect(navbarBrand.nativeElement.textContent).toBe('Infection Protection');

    navbarBrand.nativeElement.textContent = 'Foobar';
    fixture.detectChanges();
    expect(navbarBrand.nativeElement.textContent).toBe('Foobar');
  });
  it('should use toggleMenu() to flip the navbar collapse state ONLY if it receives no parameter', () => {
    expect(component.isCollapsed).toBe(true); //* Starts as collapsed

    component.toggleMenu();
    expect(component.isCollapsed).toBe(false); //* No param used so simple toggle occurs, flipping to expanded

    component.toggleMenu();
    expect(component.isCollapsed).toBe(true); //* Still no param so toggle back to collapsed

    component.toggleMenu(true);
    expect(component.isCollapsed).toBe(true); //* No toggle occurs! It was directly set to true, i.e. collapsed

    component.toggleMenu(false);
    expect(component.isCollapsed).toBe(false); //* Directly set to false, i.e. expanded
  })
  it('should collapse the navbar by default, opening and closing by clicking the toggle button', () => {
    expect(component.isCollapsed).toBe(true);
    const navToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
    expect(navToggler.attributes['aria-expanded']).toBe('false'); //* Since it's collapsed, it is NOT expanded

    navToggler.triggerEventHandler('click');
    fixture.detectChanges(); //* Using detect changes allows aria-expanded attribute to change
    expect(component.isCollapsed).toBe(false);
    expect(navToggler.attributes['aria-expanded']).toBe('true'); //* Since it's no longer collapsed, IT EXPANDED

    navToggler.triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.isCollapsed).toBe(true);
    expect(navToggler.attributes['aria-expanded']).toBe('false'); //* Since it's collapsed again, it is NOT expanded again
  })
  it('should display a divider when not collapsed', () => {
    const navToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
    expect(navToggler.attributes['aria-expanded']).toBe('false') //* Currently collapsed
    const missingDivider = fixture.debugElement.query(By.css('navbar__divider'));
    expect(missingDivider).toBeNull(); //* So divider is not inserted into the DOM

    navToggler.triggerEventHandler('click');
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('true'); //* Now the navbar is expanded
    const divider = fixture.debugElement.query(By.css('navbar__divider'));
    expect(divider).toBeDefined(); //* So the divider is rendered

    navToggler.triggerEventHandler('click');
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('false'); //* Back to collapsed
    expect(divider).toBeNull(); //* So the divider is removed from the DOM
  })
  it('should close the navbar if a navigation item is selected', () => {
    const navToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
    navToggler.triggerEventHandler('click'); //* Opening the navbar for the first time
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('true');

    //! Check the navbar brand
    const navBrand: HTMLAnchorElement =  fixture.debugElement.query(By.css('.navbar-brand')).nativeElement;
    navBrand.click(); //* Route back home and the navbar closes
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('false');

    navToggler.triggerEventHandler('click'); //* Reopen the navbar
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('true');

    //! Check the professions navLink
    const professionsNavLink: HTMLAnchorElement =  fixture.debugElement.query(By.css('a[routerLink="/professions"]')).nativeElement;
    professionsNavLink.click(); //* Route to the professions list page and the navbar closes
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('false');

    navToggler.triggerEventHandler('click'); //* Reopen the navbar
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('true');

    //! Check the reports navLink
    const reportsNavLink: HTMLAnchorElement =  fixture.debugElement.query(By.css('a[routerLink="/reports"]')).nativeElement;
    reportsNavLink.click(); //* Route to the reports list page and the navbar closes
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('false');

    navToggler.triggerEventHandler('click'); //* Reopen the navbar
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('true');
    
    //! Check the employees navLink
    const employeesNavLink: HTMLAnchorElement =  fixture.debugElement.query(By.css('a[routerLink="/employees"]')).nativeElement;
    employeesNavLink.click(); //* Route to the employees list page and the navbar closes
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('false');

    navToggler.triggerEventHandler('click'); //* Reopen the navbar
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('true');
    
    //! Check the precautions navLink
    const precautionsNavLink: HTMLAnchorElement =  fixture.debugElement.query(By.css('a[routerLink="/precautions"]')).nativeElement;
    precautionsNavLink.click(); //* Route to the precautions list page and the navbar closes
    fixture.detectChanges();
    expect(navToggler.attributes['aria-expanded']).toBe('false');
  })
});
