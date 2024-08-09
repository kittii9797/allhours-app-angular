import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/AppService.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isTokenAvailable: boolean = false;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    this.checkTokenAvailability();

    this.appService.getTokenStatus().subscribe((isAvailable: boolean) => {
      this.isTokenAvailable = isAvailable;
    });
  }

  private checkTokenAvailability() {
    this.isTokenAvailable = this.appService.checkTokenAvailability();
  }
}
