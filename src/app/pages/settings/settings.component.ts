import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../../services/AppService.service';
import { TOKEN } from '../../utils/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

  accessToken: string = '';
  wrongCredentials: boolean = false;
  authentication: boolean = false;
  clientId: string = '';
  clientSecret: string = '';

  constructor(private appService: AppService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.checkCredentialsAvailability();
  }

  public saveCredentials() {
    if (this.accessToken.trim() !== '') {
      this.appService.saveAccessToken(this.accessToken.trim()); // Save the access token using the AppService method
      this.authentication = true; // Update authentication status
      this.wrongCredentials = false; // Reset error message
      this.cdr.detectChanges(); // Trigger change detection
    } else {
      this.wrongCredentials = true; // Show error message
    }
  }

  public checkCredentialsAvailability() {
    const token = localStorage.getItem(TOKEN);
    if (this.clientId && this.clientSecret || token) {
      this.appService.authenticate(this.clientId, this.clientSecret).subscribe({
        next: () => {
          this.authentication = true;
          this.wrongCredentials = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.wrongCredentials = true;
          this.authentication = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      //this.wrongCredentials = true;
      this.authentication = false;
      this.cdr.detectChanges();
    }
  }
  
  public removeToken() {
    this.appService.removeAccessToken();
    this.authentication = false;
    this.accessToken = '';
    this.cdr.detectChanges();
  }
}
