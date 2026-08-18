import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = 'client@test.com';
  password = 'Password123!';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async login(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.login(this.email, this.password);

      this.successMessage = `Connexion réussie. Bienvenue ${result.user.firstName}.`;
      this.cdr.detectChanges();

      setTimeout(() => {
        if (result.user.role === 'Restaurateur') {
  this.router.navigate(['/restaurateur']);
} else if (result.user.role === 'Livreur') {
  this.router.navigate(['/livreur']);
} else {
  this.router.navigate(['/restaurants']);
}
      }, 500);
    } catch (error) {
      this.errorMessage = 'Email ou mot de passe invalide.';
      this.cdr.detectChanges();
    }
  }
}