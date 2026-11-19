import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { PostsService } from '../../services/posts';
import { Publicacion } from '../../models/post';

@Component({
  selector: 'app-post',
  imports: [ReactiveFormsModule],
  templateUrl: './post.html'
})
export class Post implements OnInit {
  private postsService = inject(PostsService);
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  publicaciones = signal<Publicacion[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  eliminando = signal<number | null>(null);
  error = signal('');
  mensaje = signal('');
  editando = signal<number | null>(null);
  private creados = new Set<number>();
  private proximoId = 101;

  formulario = this.fb.nonNullable.group({
    title: ['', Validators.required],
    body: ['', Validators.required]
  });

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.postsService.listar().subscribe({
      next: datos => {
        this.publicaciones.set(datos.slice(0, 5));
        this.proximoId = Math.max(100, ...datos.map(p => p.id)) + 1;
        this.creados.clear();
        this.cargando.set(false);
      },
      error: () => { this.error.set('No se pudieron cargar las publicaciones.'); this.cargando.set(false); }
    });
  }

  editar(post: Publicacion) {
    this.editando.set(post.id);
    this.formulario.setValue({ title: post.title, body: post.body });
    this.error.set('');
    this.mensaje.set('');
  }

  cancelar() {
    this.editando.set(null);
    this.formulario.reset({ title: '', body: '' });
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const datos = { userId: 1, ...this.formulario.getRawValue() };
    const id = this.editando();
    this.error.set('');
    this.mensaje.set('');
    this.guardando.set(true);
    if (id !== null) {
      // Los registros creados en esta sesión no existen realmente en la API.
      if (this.creados.has(id)) {
        this.publicaciones.update(lista => lista.map(p => p.id === id ? { id, ...datos } : p));
        this.guardando.set(false);
        this.mensaje.set('Publicación actualizada en pantalla (API de prueba).');
        this.cancelar();
        return;
      }
      this.postsService.actualizar(id, datos).subscribe({
        next: () => {
          this.publicaciones.update(lista => lista.map(p => p.id === id ? { id, ...datos } : p));
          this.guardando.set(false);
          this.mensaje.set('Publicación actualizada (simulación).');
          this.cancelar();
        },
        error: () => { this.error.set('No fue posible actualizar.'); this.guardando.set(false); }
      });
    } else {
      this.postsService.crear(datos).subscribe({
        next: () => {
          const nuevo = { id: this.proximoId++, ...datos };
          this.creados.add(nuevo.id);
          this.publicaciones.update(lista => [nuevo, ...lista].slice(0, 5));
          this.guardando.set(false);
          this.mensaje.set('Publicación creada (simulación).');
          this.cancelar();
        },
        error: () => { this.error.set('No fue posible crear.'); this.guardando.set(false); }
      });
    }
  }

  eliminar(post: Publicacion) {
    if (this.eliminando() !== null) return;
    this.error.set('');
    this.mensaje.set('');
    if (this.creados.has(post.id)) {
      this.publicaciones.update(lista => lista.filter(p => p.id !== post.id));
      this.creados.delete(post.id);
      this.mensaje.set('Publicación eliminada de la pantalla.');
      if (this.editando() === post.id) this.cancelar();
      return;
    }
    this.eliminando.set(post.id);
    this.postsService.eliminar(post.id).subscribe({
      next: () => {
        this.publicaciones.update(lista => lista.filter(p => p.id !== post.id));
        this.mensaje.set('Publicación eliminada (simulación).');
        this.eliminando.set(null);
        if (this.editando() === post.id) this.cancelar();
      },
      error: () => { this.error.set('No fue posible eliminar la publicación.'); this.eliminando.set(null); }
    });
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
