import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { LoadingController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(8)])
      )
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.login(email, password);
  }

  login(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: "Logging in..."
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.login(email, password).subscribe(
          responseData => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl("/profile");
          },
          errorData => {
            this.isLoading = false;
            loadingEl.dismiss();
            let message = "Could not signup, try again later";
            if (errorData.error.error.message === "EMAIL_NOT_FOUND") {
              message = "Email could not be found";
            } else if (errorData.error.error.message === "INVALID_PASSWORD") {
              message = "Password is not correct";
            }
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: "Authentication failed!",
        message: message,
        buttons: ["Ok"]
      })
      .then(alertEl => alertEl.present());
  }
}
