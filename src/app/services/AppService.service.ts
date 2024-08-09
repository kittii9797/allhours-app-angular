import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { TokenObject } from "../models/authentication";
import { User, UserRequest } from "../models/user";
import { TOKEN, TOKEN_EXPIRATION_DATE } from "../utils/constants";
import { Absence } from "../models/absence";

@Injectable({
  providedIn: "root"
})
export class AppService {
  private tokenSubject = new BehaviorSubject<boolean>(this.checkTokenAvailability());
  constructor(private http: HttpClient) { }

  public getTokenStatus(): Observable<boolean> {
    return this.tokenSubject.asObservable();
  }

  // Save access token to local storage
  public saveAccessToken(accessToken: string) {
    localStorage.setItem(TOKEN, accessToken);
    
    // Set token expiration to 1 hour from now
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    localStorage.setItem(TOKEN_EXPIRATION_DATE, expirationDate.toString());

    // Notify subscribers about the token status
    this.tokenSubject.next(true);
  }

  public removeAccessToken() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(TOKEN_EXPIRATION_DATE);
    this.tokenSubject.next(false); // Notify subscribers about the token status
  }

  public checkTokenAvailability() {
    return localStorage.getItem(TOKEN) !== null;
  }

  public checkIfTokenIsUnavailable() {
    const tokenExpirationDateString = localStorage.getItem(TOKEN_EXPIRATION_DATE);
    if (tokenExpirationDateString) {
      const tokenExpirationDate = new Date(tokenExpirationDateString);
      const dateNow = new Date();
      return Math.round(tokenExpirationDate.getTime() / 3600000) - Math.round(dateNow.getTime() / 3600000) >= 1;
    }
    return true;
  }

  public getUsers(): Observable<User[]> {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
      console.error('Token is missing!');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>("https://api4.allhours.com/api/v1/Users", { headers });
  }

  public addUsers(userRequest: UserRequest): Observable<any> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    return this.http.post("https://api4.allhours.com/api/v1/Users", userRequest, options);
  }

  public getAbsenceDefinitions(): Observable<any[]> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    return this.http.get<any[]>("https://api4.allhours.com/api/v1/AbsenceDefinitions", options);
  }

  public addNewAbsence(absence: Absence) {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    return this.http.post("https://api4.allhours.com/api/v1/Absences", absence, options);
  }

  public getAbsences(): Observable<Absence[]> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    return this.http.get<Absence[]>("https://api4.allhours.com/api/v1/Absences", options);
  }

  public editAbsence(absence: Absence) {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    return this.http.put(`https://api4.allhours.com/api/v1/Absences/${absence.Id}`, absence, options);
  }
}
