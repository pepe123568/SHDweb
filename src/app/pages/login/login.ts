import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  loading = signal(false);
  error = signal('');

  formulario = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  iniciarSesion() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { username, password } = this.formulario.getRawValue();
    if (username !== 'johnd') {
      this.error.set('Solo se permite el usuario johnd.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(username, password).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/posts']); },
      error: () => { this.loading.set(false); this.error.set('Usuario o contraseña incorrectos, o error de conexión.'); }
    });
  }
}
