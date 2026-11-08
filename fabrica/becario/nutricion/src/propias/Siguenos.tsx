// Cierre de marca: «Síguenos» con los logos de Nutrición Consciente (Facebook) y Orlando Castañeda Nutrición (YouTube).
import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { FPS } from "../motor/constantes";
import { F } from "../motor/estilos";
import { useFlota } from "../motor/anim";
import { Icono, Pildora } from "../piezas/basicas";
import type { DefEscena, PropsEscena } from "../tipos";

const Logo: React.FC<{ src: string; x: number; desde: number; nombre: string; red: string; icono: string }> = ({ src, x, desde, nombre, red, icono }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - desde, fps: FPS, config: { damping: 12, stiffness: 160, mass: 0.7 } });
  const fl = useFlota(0.6, 8, desde);
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: x - 200, top: 470 + fl, width: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, transform: `scale(${s})` }}>
      <div style={{ width: 300, height: 300, borderRadius: "50%", overflow: "hidden", border: `8px solid ${C.tarjeta}`, boxShadow: "0 20px 44px rgba(0,0,0,0.3)", background: "#fff" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontFamily: F.titulo, fontSize: 40, color: C.texto, textAlign: "center", lineHeight: 1.05 }}>{nombre}</div>
      <Pildora fondo={C.acento} color={C.acentoTexto}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <Icono nombre={icono} tam={38} color={C.acentoTexto} />
          {red}
        </span>
      </Pildora>
    </div>
  );
};

const Siguenos: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2] = b;
  const t = spring({ frame: f - b0, fps: FPS, config: { damping: 14, stiffness: 150 } });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontFamily: F.titulo, fontSize: 120, color: C.texto, transform: `scale(${t})` }}>
        Sí<span style={{ color: C.acento }}>guenos</span>
      </div>
      <Logo src="imagenes/logo-nc.jpg" x={300} desde={b1} nombre="Nutrición Consciente" red="Facebook" icono="thumbs-up" />
      <Logo src="imagenes/logo-orlando.jpg" x={780} desde={b2} nombre="Orlando Castañeda Nutrición" red="YouTube" icono="circle-play" />
    </AbsoluteFill>
  );
};

export const siguenos: DefEscena = {
  C: Siguenos,
  momentos: 3,
  sonidos: () => [
    [0, "whoosh", 0.3],
    [1, "pop", 0.3],
    [2, "pop", 0.3],
  ],
};
