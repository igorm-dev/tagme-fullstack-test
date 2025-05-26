import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  standalone: true,
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {}
