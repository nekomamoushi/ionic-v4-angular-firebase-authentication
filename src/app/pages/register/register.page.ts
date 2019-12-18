import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { LoadingController } from "@ionic/angular";
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
    private router: Router
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
  }

  register(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: "Logging in..."
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.signup(email, password).subscribe(responseData => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl("/profile");
        });
      });
  }
}
