import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController,
  IonContent,
  IonInput,
  IonLabel,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonLabel,
    IonButton,
    IonSpinner,
  ],
})
export class LoginPage implements OnInit {
  // Active tab: 'login' | 'register'
  activeTab: 'login' | 'register' = 'login';

  // Password visibility toggles
  showLoginPass = false;
  showRegPass = false;

  // Loading state
  isLoading = false;

  // Password strength
  passwordStrength = 0;
  strengthClass = '';

  // Selected gender
  selectedGender = 'woman';

  genderOptions = [
    { value: 'woman', label: 'Woman', icon: '👩' },
    { value: 'man', label: 'Man', icon: '👨' },
    { value: 'other', label: 'Other', icon: '🌈' },
  ];

  // Forms
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ------------------------------------------
  // LOGIN
  // ------------------------------------------
  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    try {
      // TODO: Replace with your AuthService call
      // await this.authService.login(this.loginForm.value);
      await this.simulateRequest();

      await this.showToast('Welcome back! 💖');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err) {
      await this.showAlert(
        'Login Failed',
        'Invalid email or password. Please try again.',
      );
    } finally {
      this.isLoading = false;
    }
  }

  // ------------------------------------------
  // REGISTER
  // ------------------------------------------
  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    try {
      // TODO: Replace with your AuthService call
      // await this.authService.register({ ...this.registerForm.value, gender: this.selectedGender });
      await this.simulateRequest();

      await this.showToast('Account created! Welcome to Kind-ER 💝');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err) {
      await this.showAlert(
        'Registration Failed',
        'Something went wrong. Please try again.',
      );
    } finally {
      this.isLoading = false;
    }
  }

  // ------------------------------------------
  // SOCIAL LOGIN
  // ------------------------------------------
  async socialLogin(provider: 'google' | 'apple' | 'facebook') {
    // TODO: Integrate with Capacitor social auth plugin
    // e.g. @codetrix-studio/capacitor-google-auth
    await this.showToast(`${provider} login coming soon 🌸`);
  }

  // ------------------------------------------
  // FORGOT PASSWORD
  // ------------------------------------------
  async onForgotPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Password 💌',
      message: "Enter your email and we'll send you a reset link.",
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'your@email.com',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Send Link',
          handler: async (data) => {
            if (data.email) {
              // TODO: authService.resetPassword(data.email)
              await this.showToast('Reset link sent! Check your inbox 📬');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // ------------------------------------------
  // PASSWORD STRENGTH CHECKER
  // ------------------------------------------
  checkPasswordStrength(event: any) {
    const val: string = event.target?.value ?? '';
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) || /\d/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;

    this.passwordStrength = score;
    this.strengthClass =
      score <= 2 ? 'weak' : score === 3 ? 'medium' : 'strong';
  }

  // ------------------------------------------
  // TERMS / PRIVACY
  // ------------------------------------------
  openTerms() {
    // TODO: router.navigate(['/terms']) or open browser
  }

  openPrivacy() {
    // TODO: router.navigate(['/privacy']) or open browser
  }

  // ------------------------------------------
  // HELPERS
  // ------------------------------------------
  private simulateRequest(ms = 1500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'light',
    });
    await toast.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}