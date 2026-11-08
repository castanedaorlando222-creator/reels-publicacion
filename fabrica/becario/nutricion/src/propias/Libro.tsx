// Cierre de los reels de libros: portada del libro grande y «Enlace en los comentarios».
import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { FPS } from "../motor/constantes";
import { F } from "../motor/estilos";
import { useFlota } from "../motor/anim";
import { Icono, Pildora } from "../piezas/basicas";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";

const Libro: React.FC<PropsEscena> = ({ p, b }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2] = b;
  const s = spring({ frame: f - b0, fps: FPS, config: { damping: 13, stiffness: 140, mass: 0.8 } });
  const fl = useFlota(0.5, 8, b0);
  const giro = Math.sin((f - b0) / 25) * 3;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 255, textAlign: "center", fontFamily: F.titulo, fontSize: 64, color: C.texto }}>
        {txt(p, "titulo", "Mi libro")}
      </div>
      <div style={{ position: "absolute", left: 540 - 220, top: 360 + fl, width: 440, height: 640, transform: `scale(${s}) rotate(${giro}deg)`, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.35)", background: "#fff" }}>
        <Img src={staticFile(txt(p, "portada", ""))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {f >= b1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", justifyContent: "center", transform: `scale(${spring({ frame: f - b1, fps: FPS })})` }}>
          <Pildora fondo={C.acento} color={C.acentoTexto} tam={44}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
              <Icono nombre="message-circle" tam={44} color={C.acentoTexto} />
              {txt(p, "pildora", "Enlace en los comentarios")}
            </span>
          </Pildora>
        </div>
      )}
      {f >= b2 && (
        <div style={{ position: "absolute", left: 640, top: 330, transform: `rotate(-8deg) scale(${spring({ frame: f - b2, fps: FPS })})`, background: C.oscuro, color: C.oscuroTexto, fontFamily: F.titulo, fontSize: 36, padding: "12px 22px", borderRadius: 16 }}>
          En Amazon
        </div>
      )}
    </AbsoluteFill>
  );
};

export const libro: DefEscena = {
  C: Libro,
  momentos: 3,
  sonidos: () => [
    [0, "whoosh", 0.3],
    [1, "ding", 0.3],
    [2, "pop", 0.25],
  ],
};
