import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzInputModule } from 'ng-zorro-antd/input';

registerLocaleData(en);


@NgModule({
  // import RouterModule for templates (router directives)
  imports: [BrowserModule
    , RouterModule,
    NzTableModule,
    NzInputModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  // provide Router with routes
  providers: [provideRouter(routes), { provide: NZ_I18N, useValue: en_US }],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
