import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  password = '';
  role = 'Client';

  errorMessage = '';
  successMessage = '';

  private readonly apiUrl = 'http://localhost:53477/api/Auth/register';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const roleFromUrl = this.route.snapshot.queryParamMap.get('role');

    if (
    roleFromUrl === 'Client' ||
    roleFromUrl === 'Restaurateur' ||
    roleFromUrl === 'Livreur'
  ) {
    this.role = roleFromUrl;
  }
}

async register(): Promise<void> {
  this.errorMessage = '';
  this.successMessage = '';

  if (
    !this.firstName.trim() ||
    !this.lastName.trim() ||
    !this.email.trim() ||
    !this.phoneNumber.trim() ||
    !this.password.trim() ||
    !this.role.trim()
  ) {
    this.errorMessage = 'Tous les champs sont obligatoires.';
    this.cdr.detectChanges();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.email)) {
    this.errorMessage = 'Veuillez entrer une adresse email valide.';
    this.cdr.detectChanges();
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordRegex.test(this.password)) {
    this.errorMessage =
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.';
    this.cdr.detectChanges();
    return;
  }

  const payload = {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phoneNumber: this.phoneNumber,
    password: this.password,
    role: this.role
  };

  try {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Inscription échouée.');
    }

    this.successMessage = `Compte ${this.role} créé avec succès. Vous pouvez maintenant vous connecter.`;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  } catch (error) {
    this.errorMessage = 'Impossible de créer le compte. Vérifiez les informations.';
    this.cdr.detectChanges();
  }
}
}