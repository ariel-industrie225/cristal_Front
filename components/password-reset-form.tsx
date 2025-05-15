"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowRight, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function PasswordResetForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simuler l'envoi d'un email de réinitialisation
      // Dans une application réelle, vous appelleriez une API ici
      setTimeout(() => {
        // Vérifier si l'email existe dans notre "base de données"
        const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs") || "[]")
        const utilisateurExiste = utilisateurs.some((u: any) => u.email === email)

        if (!utilisateurExiste) {
          setError("Aucun compte n'est associé à cette adresse email")
          setIsLoading(false)
          return
        }

        // Simuler l'envoi d'un email
        setIsSubmitted(true)
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de l'email")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center">
              <KeyRound className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Mot de passe oublié</h1>

          {!isSubmitted ? (
            <>
              <p className="text-center text-gray-600 mb-8">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
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

                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  Envoyer le lien
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                <p className="font-medium">Email envoyé !</p>
                <p className="text-sm mt-1">
                  Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
              </p>
              <p className="text-gray-600 text-sm">
                Si vous ne recevez pas l&apos;email dans les prochaines minutes, vérifiez votre dossier de spam.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/" className="font-medium text-violet-600 hover:text-violet-500 transition-colors">
                Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">© 2025 VotreEntreprise. Tous droits réservés.</p>
      </div>
    </div>
  )
}
