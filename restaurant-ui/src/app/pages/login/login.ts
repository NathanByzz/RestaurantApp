import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';

    this.cdr.detectChanges();
  }

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