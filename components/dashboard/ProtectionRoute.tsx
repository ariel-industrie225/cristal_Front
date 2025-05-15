"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { verifierConnexion } from "@/lib/auth"

export default function ProtectionRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [estVerifie, setEstVerifie] = useState(false)

  useEffect(() => {
    const utilisateur = verifierConnexion()

    if (!utilisateur) {
      router.push("/")
    } else {
      setEstVerifie(true)
    }
  }, [router])

  if (!estVerifie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
