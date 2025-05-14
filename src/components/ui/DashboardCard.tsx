'use client';

interface Props {
  title: string;
  value: string;
  icon: string;
}

export default function DashboardCard({ title, value, icon }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xl text-blue-600 font-bold">{value}</p>
    </div>
  );
}
