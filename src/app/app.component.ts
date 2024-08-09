import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/AppService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    this.checkAvailability();
  }

  public checkAvailability() {
    // If token is available, do nothing, otherwise navigate to settings
    if (!this.appService.checkIfTokenIsUnavailable()) {
      return; // Token is valid, do nothing
    } else {
      this.router.navigate(['/settings']); // Navigate to settings if token is invalid
    }
  }

}
