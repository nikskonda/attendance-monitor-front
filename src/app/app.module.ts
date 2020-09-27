import { BasicAuthHtppInterceptorService } from './service/basic-auth-http-interceptor.service';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import { GridCellComponent } from './grid-cell/grid-cell.component';
import { GridHeaderComponent } from './grid-header/grid-header.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import { PdfCreatorComponent } from './pdf-creator/pdf-creator.component';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
   declarations: [
      AppComponent,
      routingComponents,
      GridCellComponent,
      GridHeaderComponent,
      PdfCreatorComponent,
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      MatInputModule,
      MatGridListModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatMenuModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      HttpClientModule,
   ],
   providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: BasicAuthHtppInterceptorService, multi: true
    }
    ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
