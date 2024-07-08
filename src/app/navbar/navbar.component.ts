import { Component } from "@angular/core";

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
  isCollapsed = true;
  navBrandTitle = "Infection Protection";

  toggleMenu(collapse?: boolean) {
    this.isCollapsed = (collapse) ?? (!this.isCollapsed);
  }
}
