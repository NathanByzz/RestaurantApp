import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any | null = null;

  phoneNumber = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (this.user) {
      this.phoneNumber = this.user.phoneNumber || '';
    }
  }

  async updatePhoneNumber(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(this.phoneNumber)) {
      this.errorMessage = 'Le numéro de téléphone doit contenir exactement 10 chiffres.';
      this.cdr.detectChanges();
      return;
    }

    try {
      const result = await this.authService.updatePhoneNumber(this.phoneNumber);

      this.user = result.user;
      this.phoneNumber = result.user.phoneNumber;

      this.successMessage = 'Numéro de téléphone modifié avec succès.';
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de modifier le numéro de téléphone.';
      this.cdr.detectChanges();
    }
  }

  getBackLink(): string {
    if (!this.user) {
      return '/login';
    }

    if (this.user.role === 'Client') {
      return '/restaurants';
    }

    if (this.user.role === 'Restaurateur') {
      return '/restaurateur';
    }

    if (this.user.role === 'Livreur') {
      return '/livreur';
    }

    return '/login';
  }
}