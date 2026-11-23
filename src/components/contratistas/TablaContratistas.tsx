'use client';

import { useMemo, useState } from 'react';

export interface ResumenContratoExterno {
  id: number;
  nombre: string;
  numero_contrato: string | null;
  estado: string;
  entregas_por_resolver: number;
  contratista_empresa_id: number;
  faena_id: number;
  contrato_principal_id: number | null;
  tipo: 'contratista' | 'subcontratista';
  contratista: {
    id: number;
    nombre: string;
    rut: string | null;
  };
  faena: {
    id: number;
    nombre: string;
  };
  contrato_principal: {
    id: number;
    nombre: string;
    faena_id: number;
    contratista_empresa_id: number;
  } | null;
}

interface Props {
  contratos: ResumenContratoExterno[];
  onVerDocumentos: (contratoId: number) => void;
  deshabilitado?: boolean;
}

export default function TablaContratistas({
  contratos,
  onVerDocumentos,
  deshabilitado = false,
}: Props) {
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroRut, setFiltroRut] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFaena, setFiltroFaena] = useState('');
  const [filtroDocumental, setFiltroDocumental] = useState('');

  const faenas = useMemo(() => {
    const unicas = new Map<number, string>();

    contratos.forEach((contrato) => {
      unicas.set(contrato.faena.id, contrato.faena.nombre);
    });

    return Array.from(unicas.entries())
      .sort((a, b) => a[1].localeCompare(b[1], 'es'));
  }, [contratos]);

  const contratosFiltrados = useMemo(() => {
    const empresa = filtroEmpresa.trim().toLocaleLowerCase('es');
    const rut = filtroRut.trim().toLocaleLowerCase('es');

    return contratos.filter((contrato) => {
      const coincideEmpresa = contrato.contratista.nombre
        .toLocaleLowerCase('es')
        .includes(empresa);

      const coincideRut = (contrato.contratista.rut ?? '')
        .toLocaleLowerCase('es')
        .includes(rut);

      const coincideTipo =
        !filtroTipo || contrato.tipo === filtroTipo;

      const coincideFaena =
        !filtroFaena ||
        String(contrato.faena.id) === filtroFaena;

      const coincideDocumental =
        filtroDocumental === '' ||
        (filtroDocumental === 'por_revisar' &&
          contrato.entregas_por_resolver > 0) ||
        (filtroDocumental === 'sin_revision' &&
          contrato.entregas_por_resolver === 0);

      return (
        coincideEmpresa &&
        coincideRut &&
        coincideTipo &&
        coincideFaena &&
        coincideDocumental
      );
    });
  }, [contratos, filtroEmpresa, filtroRut, filtroTipo, filtroFaena, filtroDocumental]);

  return (
    <div className="mt-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="search"
          placeholder="Buscar por empresa..."
          aria-label="Buscar por empresa"
          value={filtroEmpresa}
          onChange={(event) => setFiltroEmpresa(event.target.value)}
          className="rounded border p-2"
        />

        <input
          type="search"
          placeholder="Buscar por RUT..."
          aria-label="Buscar por RUT"
          value={filtroRut}
          onChange={(event) => setFiltroRut(event.target.value)}
          className="rounded border p-2"
        />

        <select
          aria-label="Filtrar por tipo de contrato"
          value={filtroTipo}
          onChange={(event) => setFiltroTipo(event.target.value)}
          className="rounded border p-2"
        >
          <option value="">Todos los tipos</option>
          <option value="contratista">Contratistas</option>
          <option value="subcontratista">Subcontratistas</option>
        </select>

        <select
          aria-label="Filtrar por faena"
          value={filtroFaena}
          onChange={(event) => setFiltroFaena(event.target.value)}
          className="rounded border p-2"
        >
          <option value="">Todas las faenas</option>
          {faenas.map(([id, nombre]) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por revisión documental"
          value={filtroDocumental}
          onChange={(event) => setFiltroDocumental(event.target.value)}
          className="rounded border p-2"
        >
          <option value="">Todos los estados documentales</option>
          <option value="por_revisar">Con entregas por revisar</option>
          <option value="sin_revision">Sin entregas por revisar</option>
        </select>
      </div>

      <h2 className="mb-2 text-lg font-semibold">
        Contratos externos
        <span className="ml-2 text-sm font-normal text-gray-600">
          Mostrando {contratosFiltrados.length} de {contratos.length} contratos
        </span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Empresa</th>
              <th className="p-2">RUT</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Contrato</th>
              <th className="p-2">Faena</th>
              <th className="p-2">Estado del contrato</th>
              <th className="p-2">Por revisar</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {contratosFiltrados.map((contrato) => (
              <tr
                key={contrato.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-2 font-medium">
                  {contrato.contratista.nombre}
                </td>

                <td className="whitespace-nowrap p-2">
                  {contrato.contratista.rut || '—'}
                </td>

                <td className="p-2">
                  {contrato.tipo === 'subcontratista'
                    ? 'Subcontratista'
                    : 'Contratista'}
                </td>

                <td className="p-2">
                  <div className="font-medium">
                    {contrato.numero_contrato || `#${contrato.id}`}
                  </div>
                  <div className="text-gray-600">
                    {contrato.nombre}
                  </div>

                  {contrato.contrato_principal && (
                    <div className="mt-1 text-xs text-gray-500">
                      Principal: {contrato.contrato_principal.nombre}
                    </div>
                  )}
                </td>

                <td className="p-2">
                  {contrato.faena.nombre}
                </td>

                <td className="p-2">
                  <span className="capitalize">
                    {contrato.estado.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="p-2">
                  {Number.isSafeInteger(contrato.entregas_por_resolver) &&
                  contrato.entregas_por_resolver >= 0 ? (
                    <span
                      className={`inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        contrato.entregas_por_resolver > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                      title="Últimas entregas pendientes o en revisión"
                    >
                      {contrato.entregas_por_resolver}
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className="p-2">
                  <button
                    type="button"
                    disabled={deshabilitado}
                    onClick={() => onVerDocumentos(contrato.id)}
                    className="whitespace-nowrap rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Ver documentos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contratosFiltrados.length === 0 && (
        <p className="mt-4 text-center text-gray-500">
          {contratos.length === 0
            ? 'No hay contratos externos registrados.'
            : 'No se encontraron contratos con los filtros aplicados.'}
        </p>
      )}
    </div>
  );
}
