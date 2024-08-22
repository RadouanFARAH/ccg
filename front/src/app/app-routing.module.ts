import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { P0LoginComponent } from './components/p0-login/p0-login.component';
import { P1HomeComponent } from './components/p1-home/p1-home.component'
import { P2ModificationAComponent } from './components/p2-modification-a/p2-modification-a.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'modification-a', component: P2ModificationAComponent, canActivate: [AuthGuard] },
  { path: 'home', component: P1HomeComponent },
  { path: 'login', component: P0LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
