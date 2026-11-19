export interface Publicacion {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export type DatosPublicacion = Pick<Publicacion, 'userId' | 'title' | 'body'>;
