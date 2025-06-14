'use client';

interface Props {
  title: string;
  value: string;
  icon?: string;
}

export default function DashboardCard({ title, value, icon }: Props) {
  return (
    <div
      className="
        bg-white border rounded-lg p-4 shadow-sm
        hover:bg-blue-50 hover:shadow-md transition duration-300
        cursor-pointer
      "
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-blue-700">{value}</p>
    </div>
  );
}
