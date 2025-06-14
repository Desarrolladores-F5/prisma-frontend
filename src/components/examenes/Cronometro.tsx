// src/components/examenes/Cronometro.tsx
'use client';

import { useEffect, useState } from 'react';

interface Props {
  duracionMinutos?: number;
  onTiempoFinalizado?: () => void;
}

export default function Cronometro({ duracionMinutos = 20, onTiempoFinalizado }: Props) {
  const [segundosRestantes, setSegundosRestantes] = useState(duracionMinutos * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTiempoFinalizado?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duracionMinutos, onTiempoFinalizado]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  return (
  <div className="text-right text-xl font-bold text-red-700">
    ⏳ Tiempo restante: {minutos.toString().padStart(2, '0')}:{segundos.toString().padStart(2, '0')}
  </div>
);

}
