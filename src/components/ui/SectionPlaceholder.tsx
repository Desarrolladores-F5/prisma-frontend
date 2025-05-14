'use client';

interface Props {
  title: string;
}

export default function SectionPlaceholder({ title }: Props) {
  return (
    <div>
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="border border-dashed border-gray-300 p-4 rounded">
        Aquí se mostrarán los datos relacionados.
      </div>
    </div>
  );
}
