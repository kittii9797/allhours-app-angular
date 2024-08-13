import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, of, throwError } from "rxjs";
import { map, tap, mapTo, catchError } from "rxjs/operators";
import { TokenObject } from "../models/authentication";
import { User, UserRequest } from "../models/user";
import { CLIENT_ID, CLIENT_SECRET, TOKEN, TOKEN_EXPIRATION_DATE } from "../utils/constants";
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
    const tokenExpirationDateString = localStorage.getItem(TOKEN_EXPIRATION_DATE);
    if (tokenExpirationDateString) {
      const tokenExpirationDate = new Date(tokenExpirationDateString);
      const dateNow = new Date();
      return tokenExpirationDate.getTime() > dateNow.getTime();
    }
    return false; // Token is not available if expiration date is missing
  }

  public checkIfTokenIsUnavailable() {
    return localStorage.getItem(TOKEN) !== null;
  }

  // Fetch access token
  private fetchAccessToken(clientId: string, clientSecret: string): Observable<string> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);
    body.set('scope', 'api');

    return this.http.post<{ access_token: string }>('/connect/token', body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      map(response => response.access_token),
      catchError(error => {
        console.error('Error fetching access token:', error);
        return throwError('Failed to fetch access token');
      })
    );
  }
  

  public authenticate(clientId: string, clientSecret: string): Observable<void> {
    if (!this.checkTokenAvailability()) {
      return this.fetchAccessToken(clientId, clientSecret).pipe(
        tap(token => {
          this.saveAccessToken(token);
          console.log('Access Token:', token);
        }),
        mapTo(void 0)
      );
    } else {
      console.log('Token is already available');
      return of(void 0);
    }
  }

  public getUsers(): Observable<User[]> {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
      console.error('Token is missing!');
      return throwError('Token is missing!');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>("https://api4.allhours.com/api/v1/Users", { headers }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError('Failed to fetch users');
      })
    );
  }

  public addUsers(userRequest: UserRequest): Observable<any> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post("https://api4.allhours.com/api/v1/Users", userRequest, { headers }).pipe(
      catchError(error => {
        console.error('Error adding user:', error);
        return throwError('Failed to add user');
      })
    );
  }

  public getAbsenceDefinitions(): Observable<any[]> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>("https://api4.allhours.com/api/v1/AbsenceDefinitions", { headers }).pipe(
      catchError(error => {
        console.error('Error fetching absence definitions:', error);
        return throwError('Failed to fetch absence definitions');
      })
    );
  }

  public addNewAbsence(absence: Absence): Observable<any> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post("https://api4.allhours.com/api/v1/Absences", absence, { headers }).pipe(
      catchError(error => {
        console.error('Error adding absence:', error);
        return throwError('Failed to add absence');
      })
    );
  }

  public getAbsences(): Observable<Absence[]> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Absence[]>("https://api4.allhours.com/api/v1/Absences", { headers }).pipe(
      catchError(error => {
        console.error('Error fetching absences:', error);
        return throwError('Failed to fetch absences');
      })
    );
  }

  public editAbsence(absence: Absence): Observable<any> {
    const token = localStorage.getItem(TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`https://api4.allhours.com/api/v1/Absences/${absence.Id}`, absence, { headers }).pipe(
      catchError(error => {
        console.error('Error editing absence:', error);
        return throwError('Failed to edit absence');
      })
    );
  }
}
