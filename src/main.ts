import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import 'zone.js'; 
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
         positionClass: 'toast-bottom-center', 
      })
    )
  ]
}).catch(err => console.error(err));
  document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor") as HTMLElement;
  if (cursor) {
    cursor.style.top = e.clientY + "px";
    cursor.style.left = e.clientX + "px";
  }
});