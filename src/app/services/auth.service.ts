import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

export class User {
  constructor(
    public localId: string,
    public email: string,
    private _tokenId: string,
    private _expiresIn: string
  ) {}

  get token() {
    return this._tokenId;
  }
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  _user = new BehaviorSubject<User>(null);

  get userAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        console.log(user);
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
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
      .pipe(tap(this.setUser.bind(this)));
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
      .pipe(tap(this.setUser.bind(this)));
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
    this._user.next(null);
  }

  setUser(data: any) {
    const userData = new User(
      data.localId,
      data.email,
      data.idToken,
      data.expiresIn
    );
    this._user.next(userData);
  }
}
