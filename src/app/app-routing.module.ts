import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfessionsComponent } from "./professions/professions.component";
import { ProfessionDetailComponent } from "./profession-detail/profession-detail.component";
import { AddProfessionComponent } from "./add-profession/add-profession.component";

// ! By convention, you create this from the start or by command (ng g module app-routing --flat --module=app)
// * --flat flag puts file in src/app instead of its own folder
// * --module=app registers it in imports array of AppModule
// ! By convention, it belongs in src/app

// ! All Ang routes are two parts, path and component
const routes: Routes = [
  { path: "professions", component: ProfessionsComponent },
  { path: "profession/:id", component: ProfessionDetailComponent },
  { path: "professions/add", component: AddProfessionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // ! Adds to ngModule imports array, then configures routes for full availability across app
  exports: [RouterModule]
})
export class AppRoutingModule {}
