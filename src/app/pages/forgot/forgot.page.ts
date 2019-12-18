import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.page.html",
  styleUrls: ["./forgot.page.scss"]
})
export class ForgotPage implements OnInit {
  forgotForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      )
    });
  }

  onSubmit() {
    if (!this.forgotForm.valid) {
      return;
    }
    const { email } = this.forgotForm.value;
    this.sendEmail(email);
  }

  sendEmail(email: string) {
    this.authService.forgot(email).subscribe(
      responseData => {
        this.router.navigateByUrl("/login");
      },
      errorResponse => {
        let message = "Could not send email, try again later";
        if (errorResponse.error.error.message === "EMAIL_NOT_FOUND") {
          message = "Email could not be found";
        }
        this.showAlert(message);
      }
    );
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: "Send email failed!",
        message: message,
        buttons: ["Ok"]
      })
      .then(alertEl => alertEl.present());
  }
}
