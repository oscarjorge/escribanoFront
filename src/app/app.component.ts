import { Component, ViewEncapsulation } from '@angular/core';
import { RoutingState } from './services/routing/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'ProjectManagement';
  constructor(routingState: RoutingState){
    routingState.loadRouting();
  }
}
