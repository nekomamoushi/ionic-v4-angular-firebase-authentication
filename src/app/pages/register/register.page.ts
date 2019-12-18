import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { LoadingController, AlertController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.compose([Validators.required, Validators.minLength(3)])
        ])
      ),
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
    if (!this.registerForm.valid) {
      return;
    }
    const { email, password } = this.registerForm.value;
    this.register(email, password);
    this.registerForm.reset();
  }

  register(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: "Logging in..."
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.signup(email, password).subscribe(
          responseData => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl("/profile");
          },
          errorData => {
            this.isLoading = false;
            loadingEl.dismiss();
            let message = "Could not signup, try again later";
            if (errorData.error.error.message === "EMAIL_EXISTS") {
              message = "This email address already exists";
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
