// src/components/faenas/SelectFaenas.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerFaenas } from '@/lib/api';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  required?: boolean;
}

export default function SelectFaenas({ value, onChange, name = 'faena_id', required = true }: Props) {
  const [faenas, setFaenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaenas = async () => {
      const data = await obtenerFaenas();
      setFaenas(data);
      setLoading(false);
    };

    fetchFaenas();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Faena</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione una faena</option>
        {faenas.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nombre}
          </option>
        ))}
      </select>
      {loading && <p className="text-xs text-gray-500 mt-1">Cargando faenas...</p>}
    </div>
  );
}
