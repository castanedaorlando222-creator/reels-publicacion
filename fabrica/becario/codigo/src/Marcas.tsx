// El Código de los Mejores: un solo logo fijo arriba a la derecha durante todo el reel.
// Se ocultan durante la escena de cierre "Siguenos", que ya los muestra en grande.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PLAN } from "./motor/actual";
import { ESCENAS } from "./motor/linea";

const Circulo: React.FC<{ src: string; tam: number; style: React.CSSProperties; op: number }> = ({ src, tam, style, op }) => (
  <div style={{ position: "absolute", width: tam, height: tam, borderRadius: "50%", overflow: "hidden", border: "5px solid #ffffff", boxShadow: "0 10px 24px rgba(0,0,0,0.28)", background: "#ffffff", opacity: op, ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

export const Marcas: React.FC = () => {
  const f = useCurrentFrame();
  const cierre = ESCENAS.find((e) => (PLAN.frases[e.i].escena as { nombre?: string } | undefined)?.nombre === "Siguenos");
  const hasta = cierre ? cierre.ini : Infinity;
  const op = interpolate(f, [4, 16, hasta - 8, hasta], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return (
    <>
      <Circulo src="imagenes/logo-codigo.jpg" tam={150} op={op} style={{ top: 80, right: 40 }} />
    </>
  );
};
