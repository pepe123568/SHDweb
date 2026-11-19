import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publicacion, DatosPublicacion } from '../models/post';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);
  private url = 'https://jsonplaceholder.typicode.com/posts';

  listar() { return this.http.get<Publicacion[]>(`${this.url}?_limit=5`); }
  crear(datos: DatosPublicacion) { return this.http.post<Publicacion>(this.url, datos); }
  actualizar(id: number, datos: DatosPublicacion) {
    return this.http.put<Publicacion>(`${this.url}/${id}`, { id, ...datos });
  }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
