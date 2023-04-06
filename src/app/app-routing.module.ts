import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfessionsComponent } from "./professions/professions.component";
import { ProfessionDetailComponent } from "./profession-detail/profession-detail.component";
import { AddProfessionComponent } from "./add-profession/add-profession.component";

//? Ang-Router requires this file in src/app, so to add it, use `ng g module app-routing --flat --module=app`
//? "--flat" puts file in src/app instead of its own folder
//? "--module=app" registers it in the AppModule's imports array

//? All Ang routes have two properties, path and component
const routes: Routes = [
  { path: "professions", component: ProfessionsComponent },
  { path: "profession/:id", component: ProfessionDetailComponent },
  { path: "professions/add", component: AddProfessionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //? THIS LINE adds the routes to the imports array, activating them across the app
  exports: [RouterModule]
})
export class AppRoutingModule {}
