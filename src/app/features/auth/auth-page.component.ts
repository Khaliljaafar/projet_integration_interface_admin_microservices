import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminStateService, PlatformRole } from '../../core/services/admin-state.service';
import { UserService } from '../../core/services/api/user.service';
import { RoleService } from '../../core/services/api/role.service';
import { UserRegistrationRequestDto } from '../../core/models/user.model';
import { catchError, of, switchMap } from 'rxjs';
import { AdminOwnerRequestApiService } from '../../core/services/api/admin-owner-request.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly adminStateService = inject(AdminStateService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly adminOwnerReqApi = inject(AdminOwnerRequestApiService);

  readonly mode = signal<'signin' | 'signup'>('signin');
  readonly selectedRole = signal<PlatformRole>('owner');
  readonly experienceLevels = ['Débutant', 'Expérimenté', 'Expert'];

  readonly heroTitle = computed(() =>
    this.mode() === 'signin' ? 'Bienvenue de retour!' : 'Créez votre espace en 2 minutes'
  );

  readonly heroSubtitle = computed(() => {
    if (this.selectedRole() === 'super-admin') {
      return 'Connexion sécurisée réservée au Super Admin.';
    }
    if (this.selectedRole() === 'owner') {
      return 'Pilotez vos terrains, réservations et équipes en temps réel.';
    }
    return 'Accédez aux réservations premium pour chaque match.';
  });

  readonly signinForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  readonly signupForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required]],
    club: [''],
    experience: ['Débutant'],
    role: ['owner' as PlatformRole, [Validators.required]]
  });

  readonly roleOptions: { value: PlatformRole; label: string }[] = [
    { value: 'player', label: 'Client / Joueur' },
    { value: 'owner', label: 'Admin (Owner)' },
  ];

  feedbackMessage = signal<string>('');

  switchMode(target: 'signin' | 'signup') {
    this.mode.set(target);
  }

  updateRole(role: PlatformRole) {
    this.selectedRole.set(role);
    this.signupForm.patchValue({ role });
  }

  submitSignin() {
    if (this.signinForm.invalid) {
      this.feedbackMessage.set('Veuillez compléter les champs requis.');
      return;
    }

    const { username, password } = this.signinForm.getRawValue();
    this.authService.loginWithResponse(username!, password!).subscribe({
      next: res => {
        if (!res.authenticated) {
          // Show backend message when credentials are invalid, account missing, or banned
          const msg = res.message || 'Identifiants incorrects ou compte inexistant.';
          this.feedbackMessage.set(msg);
          return;
        }
        const actual = this.authService.currentRole();
        const selected = this.selectedRole();
        // If actual is super-admin, ignore selection mismatch. Otherwise enforce match.
        if (actual !== selected && actual !== 'super-admin') {
          this.feedbackMessage.set('Identifiants incorrects ou compte inexistant.');
          this.authService.clearSession();
          return;
        }
        this.navigateAfterAuth(actual);
      },
      error: () => {
        this.feedbackMessage.set('Erreur de connexion. Veuillez réessayer.');
      }
    });
  }

  submitSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, email, phone, club, experience, password, confirmPassword } = this.signupForm.getRawValue();
    if ((password || '').length < 6) {
      this.feedbackMessage.set('Mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      this.feedbackMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }
    const role = this.selectedRole();
    const [firstName, ...rest] = String(fullName || '').trim().split(' ');
    const secondName = rest.join(' ') || firstName || 'User';
    const username = String(email || `${firstName}.${secondName}`.toLowerCase().replace(/\s+/g, ''));
    const targetRoleLabel = role === 'owner' ? 'Admin' : role === 'player' ? 'Client' : 'Super_admin';

    this.roleService.list().pipe(
      switchMap(roles => {
        const found = roles.find(r => r.label.toLowerCase() === targetRoleLabel.toLowerCase());
        if (!found) {
          throw new Error('Role introuvable');
        }
        const payload: UserRegistrationRequestDto = {
          username,
          password: String(password),
          roleId: found.id,
          firstName: firstName || 'User',
          secondName,
          phoneNumber: String(phone || ''),
          address: String(club || ''),
          // Optional fields omitted
        } as UserRegistrationRequestDto;
        return this.userService.register(payload);
      }),
      catchError(() => {
        this.feedbackMessage.set("Erreur lors de l'inscription. Veuillez réessayer.");
        return of(null);
      })
    ).subscribe(res => {
      if (!res) return;
      // Auto-submit admin request for owners (no stadium required now)
      if (this.selectedRole() === 'owner') {
        const userId = Number(res.id);
        if (!Number.isNaN(userId)) {
          this.adminOwnerReqApi.submit({ userId }).subscribe({
            next: () => {},
            error: () => {}
          });
        }
      }
      this.feedbackMessage.set('Inscription réussie ✔️. Vous pouvez maintenant vous connecter.');
      this.switchMode('signin');
    });
  }

  private navigateAfterAuth(role: PlatformRole) {
    if (role === 'super-admin') {
      this.router.navigate(['/super-admin']);
      return;
    }

    if (role === 'owner') {
      this.router.navigate(['/owner']);
      return;
    }

    // Client/Joueur
    this.router.navigate(['/player']);
  }
}
