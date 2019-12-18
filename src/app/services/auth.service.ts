import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  _isAuthenticated = false;

  get isAuth() {
    return this._isAuthenticated;
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        tap(() => {
          this._isAuthenticated = true;
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        tap(() => {
          this._isAuthenticated = true;
        })
      );
  }

  forgot(email: string) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${environment.firebaseApiKey}`,
      {
        requestType: "PASSWORD_RESET",
        email: email,
        returnSecureToken: true
      }
    );
  }

  logout() {
    this._isAuthenticated = false;
  }
}
