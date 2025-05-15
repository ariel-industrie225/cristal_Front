"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { redirect, useRouter, useSearchParams } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Vérifier si l'utilisateur vient de s'inscrire
    const inscription = searchParams.get("inscription")
    if (inscription === "success") {
      setSuccessMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsLoading(true)

    try {
      const req = await fetch("http://localhost:2025/api/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const res = await req.json()
      
      if (res.message === "ok") {
        console.log("Réponse backend :", res)
        // Stocker l'utilisateur connecté
        //localStorage.setItem("token", data.token)
        //localStorage.setItem("utilisateurConnecte", JSON.stringify(data.utilisateur || {}))

        // Rediriger vers le dashboard ou la page d'accueil
        router.push("/dashboard")
      } else {
        setError(res.message || "Email ou mot de passe incorrect")
        setIsLoading(false)
      }
      // Simuler une connexion
      // setTimeout(() => {
      //   // Vérifier les identifiants dans notre "base de données"
      //   // const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs") || "[]")
      //   // const utilisateur = utilisateurs.find((u: any) => u.email === email && u.motDePasse === password)

      //   // if (!utilisateur) {
      //   //   setError("Email ou mot de passe incorrect")
      //   //   setIsLoading(false)
      //   //   return
      //   // }
      // }, 1500)
    } catch (error) {
      console.log(error)
      setError("Une erreur est survenue lors de la connexion")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Se Connecter</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-10 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              Se connecter
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>

        <div className="bg-violet-50 py-4 px-8 text-center">
          <p className="text-xs text-gray-600">
            En vous connectant, vous acceptez nos{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Conditions d&apos;utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">© 2025 VotreEntreprise. Tous droits réservés.</p>
      </div>
    </div>
  )
}
