interface Props {
  icono: string;
  titulo: string;
  valor: number;
}

export default function Indicador({ icono, titulo, valor }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow text-center w-60">
      <div className="text-3xl mb-2">{icono}</div>
      <h2 className="text-sm font-semibold">{titulo}</h2>
      <p className="text-xl font-bold text-indigo-600">{valor}</p>
    </div>
  );
}
