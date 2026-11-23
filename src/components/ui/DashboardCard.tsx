'use client';

type AccentRole = 'admin' | 'supervisor' | 'trabajador';

interface Props {
  title: string;
  value: string;
  description?: string;
  icon?: string;
  /** Rol que define color de números y hover */
  accentRole?: AccentRole;
}

const valueColorByRole: Record<AccentRole, string> = {
  admin: 'text-blue-700',
  supervisor: 'text-emerald-700',
  trabajador: 'text-amber-700',
};

const hoverBgByRole: Record<AccentRole, string> = {
  admin: 'hover:bg-blue-100',
  supervisor: 'hover:bg-emerald-100',
  trabajador: 'hover:bg-amber-100',
};

export default function DashboardCard({
  title,
  value,
  description,
  icon,
  accentRole = 'admin',
}: Props) {
  const valueColor = valueColorByRole[accentRole];
  const hoverBg = hoverBgByRole[accentRole];

  return (
    <div
      className={`
        bg-white border rounded-lg p-4 shadow-sm
        ${hoverBg} hover:shadow-md hover:scale-105
        transition duration-300 transform cursor-pointer
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
    </div>
  );
}
