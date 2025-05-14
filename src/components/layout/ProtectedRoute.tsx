'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerRolDesdeToken } from '@/lib/validate-role'

interface Props {
  children: React.ReactNode
  rolPermitido?: number | number[]
}

export default function ProtectedRoute({ children, rolPermitido }: Props) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    // No hay token → acceso denegado
    if (!token) {
      router.push('/acceso-denegado')
      return
    }

    // Si se requiere rol específico
    if (rolPermitido !== undefined) {
      const rol = obtenerRolDesdeToken(token)

      const roles = Array.isArray(rolPermitido) ? rolPermitido : [rolPermitido]

      if (rol === null || !roles.includes(rol)) {
        router.push('/acceso-denegado')
        return
      }
    }

  }, [router, rolPermitido])

  return <>{children}</>
}
