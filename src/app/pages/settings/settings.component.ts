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

  private checkCredentialsAvailability() {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      this.authentication = true; // Update authentication status if token is valid
      console.log('true')
    } else {
      this.authentication = false; // Set to false if token is invalid or not found
      console.log('false')
    }
  }
  
  public removeToken() {
    this.appService.removeAccessToken(); // Remove token using the service method
    this.authentication = false;
    this.accessToken = '';
    this.cdr.detectChanges();
  }
}
