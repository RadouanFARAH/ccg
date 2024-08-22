import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { P0LoginComponent } from './components/p0-login/p0-login.component';
import { P1HomeComponent } from './components/p1-home/p1-home.component';
import { P2ModificationAComponent } from './components/p2-modification-a/p2-modification-a.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptorService } from './token-interceptor.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule  } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    P1HomeComponent,
    P2ModificationAComponent,
    P0LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, FormsModule,
    BrowserAnimationsModule,
    MatSelectModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, ReactiveFormsModule,
    NgbModule, NgbPopoverModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
