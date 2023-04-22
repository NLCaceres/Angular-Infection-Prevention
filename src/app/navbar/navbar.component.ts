import { Component } from '@angular/core';
import { NavItem } from '../NavItem';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isCollapsed = true;
  navBrand: NavItem = {
    title: 'Infection Protection'
  };

  toggleMenu(collapse?: boolean) {
    this.isCollapsed = (collapse) ?? (!this.isCollapsed);
  }
}
