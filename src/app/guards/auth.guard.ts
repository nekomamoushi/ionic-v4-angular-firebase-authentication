import { Injectable } from "@angular/core";
import { CanLoad, UrlSegment, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Route } from "@angular/compiler/src/core";
import { take, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userAuthenticated.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl("/login");
        }
      })
    );
  }
}
