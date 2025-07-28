'use client';

import { useState, useEffect } from 'react';
import { crearFirma } from '@/lib/api';
import { obtenerIdDesdeToken } from '@/lib/validate-role';
import { toast } from 'sonner';

interface Props {
  entidadId: number;
  entidadTipo: 'documento' | 'capacitacion' | string;
  onFirmado: () => void;
}

// 🔧 Nueva función para obtener IP pública
const obtenerIpPublica = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch (error) {
    console.warn('❌ No se pudo obtener IP pública:', error);
    return 'N/A';
  }
};

const FormularioFirma: React.FC<Props> = ({ entidadId, entidadTipo, onFirmado }) => {
  const [firmanteId, setFirmanteId] = useState<number | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const idUsuario = obtenerIdDesdeToken(token);
    setFirmanteId(idUsuario);
  }, []);

  const generarHash = async (): Promise<string> => {
    const raw = `${entidadTipo}-${entidadId}-${firmanteId}-${new Date().toISOString()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  // 🔄 Ahora asincrónica para incluir IP
  const obtenerMetadata = async (): Promise<Record<string, any>> => {
    const ip = await obtenerIpPublica();

    const metadataBase = {
      entidad: entidadTipo,
      entidad_id: entidadId,
      navegador: navigator.userAgent,
      dispositivo: navigator.platform,
      ip, // ✅ Se incluye la IP
      timestamp: new Date().toISOString(),
    };

    if (entidadTipo === 'documento') {
      return {
        ...metadataBase,
        documento_id: entidadId,
      };
    }

    return metadataBase;
  };

  const handleFirmar = async () => {
    if (firmanteId === null) {
      toast.error('⚠️ No se pudo obtener tu ID. Reintenta iniciar sesión.');
      return;
    }

    setProcesando(true);

    try {
      const hash = await generarHash();
      const metadata = await obtenerMetadata(); // ✅ Ahora espera la IP

      const firmaPayload = {
        firmante_id: firmanteId,
        hash_firma: hash,
        tipo_firma: 'validacion',
        metadata,
      };

      await crearFirma(firmaPayload);
      toast.success('✅ Firma digital registrada correctamente');

      onFirmado(); // Refrescar estado superior
    } catch (error) {
      console.error('❌ Error al firmar:', error);
      toast.error('❌ Ocurrió un error al registrar la firma digital');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm mt-2">
      <h2 className="text-sm font-medium mb-2">Firmar electrónicamente</h2>
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
