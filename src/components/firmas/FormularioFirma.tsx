'use client';

import { useState, useEffect } from 'react';
import { crearFirma } from '@/lib/api';
import { obtenerIdDesdeToken } from '@/lib/validate-role';

interface Props {
  entidadId: number;          // ID del objeto que se firma (ej. capacitación, inspección)
  entidadTipo: string;        // Tipo de entidad firmada (ej. 'capacitacion', 'inspeccion')
  onFirmado: () => void;      // Callback para informar que la firma fue registrada
}

const FormularioFirma: React.FC<Props> = ({ entidadId, entidadTipo, onFirmado }) => {
  const [firmanteId, setFirmanteId] = useState<number | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Token no encontrado en localStorage');
      return;
    }

    const idUsuario = obtenerIdDesdeToken(token);
    setFirmanteId(idUsuario);
  }, []);

  const generarHash = async (): Promise<string> => {
    const raw = `${entidadTipo}-${entidadId}-${firmanteId}-${new Date().toISOString()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const obtenerMetadata = (): object => {
    return {
      entidad: entidadTipo,
      entidad_id: entidadId,
      navegador: navigator.userAgent,
      dispositivo: navigator.platform,
      timestamp: new Date().toISOString(),
    };
  };

  const handleFirmar = async () => {
    if (firmanteId === null) {
      console.error('❌ firmanteId no disponible');
      alert('No se pudo obtener tu ID de usuario. Reintenta iniciar sesión.');
      return;
    }

    setProcesando(true);

    try {
      const hash = await generarHash();
      const metadata = obtenerMetadata();

      const firmaPayload = {
        firmante_id: firmanteId,
        hash_firma: hash,
        tipo_firma: 'validacion',
        metadata,
      };

      console.log('📤 Enviando firma digital:', firmaPayload);

      await crearFirma(firmaPayload);
      onFirmado();
    } catch (error) {
      console.error('❌ Error al firmar:', error);
      alert('Ocurrió un error al registrar la firma digital.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-4">Firmar electrónicamente</h2>
      <button
        onClick={handleFirmar}
        disabled={procesando || firmanteId === null}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {procesando ? 'Procesando...' : 'Firmar'}
      </button>
    </div>
  );
};

export default FormularioFirma;
