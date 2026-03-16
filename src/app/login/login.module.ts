import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController,
  IonContent,
  IonInput,
  IonLabel,
  IonButton,
  IonSpinner,
  IonIcon, // Added this in case you use Ionic icons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, personOutline, calendarOutline } from 'ionicons/icons';

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
    IonIcon,
  ],
})
export class LoginPage implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  showLoginPass = false;
  showRegPass = false;
  isLoading = false;
  passwordStrength = 0;
  strengthClass = '';
  selectedGender = 'woman';

  // Professional emoji set or use IonIcons
  genderOptions = [
    { value: 'woman', label: 'Woman', icon: 'woman-outline' },
    { value: 'man', label: 'Man', icon: 'man-outline' },
    { value: 'other', label: 'Other', icon: 'people-outline' },
  ];

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    // Registering icons for standalone use
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, personOutline, calendarOutline });
  }

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

  async onLogin() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading = true;
    try {
      await this.simulateRequest();
      await this.showToast('Welcome back to Kind-ER! ✨'); // Professional spark
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch {
      await this.showAlert('Login Failed', 'Invalid email or password.');
    } finally {
      this.isLoading = false;
    }
  }

  async onRegister() {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.isLoading = true;
    try {
      await this.simulateRequest();
      await this.showToast('Welcome to Kind-ER 💝');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch {
      await this.showAlert('Registration Failed', 'Something went wrong.');
    } finally {
      this.isLoading = false;
    }
  }

  async socialLogin(provider: string) {
    await this.showToast(`${provider} login coming soon 🌸`);
  }

  async onForgotPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Password 💌',
      message: "Enter your email and we'll send a reset link.",
      inputs: [{ name: 'email', type: 'email', placeholder: 'your@email.com' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Send Link', handler: async (d) => { if (d.email) await this.showToast('Reset link sent! 📬'); } },
      ],
    });
    await alert.present();
  }

  checkPasswordStrength(event: any) {
    const val: string = event.target?.value ?? '';
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) || /\d/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;
    this.passwordStrength = score;
    this.strengthClass = score <= 2 ? 'weak' : score === 3 ? 'medium' : 'strong';
  }

  openTerms()   {}
  openPrivacy() {}

  private simulateRequest(ms = 1500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async showToast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, position: 'bottom' });
    await t.present();
  }

  private async showAlert(header: string, message: string) {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}