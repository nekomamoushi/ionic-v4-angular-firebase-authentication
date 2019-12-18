import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  _isAuthenticated = false;
  firebaseKey = "AIzaSyCyqoH3kuXG3hp6WuSWm78kd_kctNFaRA8";

  get isAuth() {
    return this._isAuthenticated;
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.firebaseKey}`,
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

  login() {
    this._isAuthenticated = true;
  }

  logout() {
    this._isAuthenticated = false;
  }
}
