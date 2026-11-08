// Escenas propias registradas para usar en el plan con "tipo": "propia", "nombre": "…".
import type { DefEscena } from "../tipos";
import { ejemplo } from "./Ejemplo";
import { libro } from "./Libro";
import { siguenos } from "./Siguenos";

export const PROPIAS: Record<string, DefEscena> = {
  Ejemplo: ejemplo,
  Siguenos: siguenos,
  Libro: libro,
};
