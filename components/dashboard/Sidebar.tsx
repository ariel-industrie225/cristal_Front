"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { deconnexion } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Menu, X, Home, Upload, FileText, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [utilisateur, setUtilisateur] = useState<any>(null)
  const { isOpen, setIsOpen, isMobile } = useSidebar()

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const utilisateurConnecte = localStorage.getItem("utilisateurConnecte")
    if (utilisateurConnecte) {
      setUtilisateur(JSON.parse(utilisateurConnecte))
    }
  }, [])

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState)
  }

  // Classe pour l'élément de navigation actif
  const activeClass = "bg-violet-100 text-violet-700 font-medium"
  const inactiveClass = "text-gray-600 hover:bg-violet-50 hover:text-violet-600"

  const handleDeconnexion = () => {
    deconnexion()
    router.push("/")
  }

  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 ${isOpen ? "left-64" : "left-4"} z-50 p-2 rounded-md bg-white shadow-md text-gray-700`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay pour mobile quand le menu est ouvert */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar - Maintenant elle reste toujours visible, juste plus étroite quand repliée */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } ${isMobile ? "w-64" : isOpen ? "w-64" : "w-20"} bg-white shadow-lg flex flex-col`}
      >
        {/* En-tête de la sidebar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {isOpen || isMobile ? (
            <h1 className="text-xl font-bold text-violet-700">Dashboard</h1>
          ) : (
            <div className="w-full flex justify-center">
              <Home className="h-6 w-6 text-violet-700" />
            </div>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-violet-50 text-gray-500"
              aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        {/* Profil utilisateur */}
        <div className="p-4 border-b border-gray-100">
          {isOpen || isMobile ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                <User className="h-5 w-5 text-violet-600" />
              </div>
              {utilisateur && (
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-800 truncate">{utilisateur.nom || "Utilisateur"}</p>
                  <p className="text-xs text-gray-500 truncate">{utilisateur.email}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                <User className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center ${!isOpen && !isMobile ? "justify-center" : "space-x-3"} p-3 rounded-md transition-colors ${
                  pathname === "/dashboard" ? activeClass : inactiveClass
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
                {(isOpen || isMobile) && <span>Accueil</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/chargement"
                className={`flex items-center ${!isOpen && !isMobile ? "justify-center" : "space-x-3"} p-3 rounded-md transition-colors ${
                  pathname === "/dashboard/chargement" ? activeClass : inactiveClass
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Upload className="h-5 w-5" />
                {(isOpen || isMobile) && <span>Chargement</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/consultation"
                className={`flex items-center ${!isOpen && !isMobile ? "justify-center" : "space-x-3"} p-3 rounded-md transition-colors ${
                  pathname === "/dashboard/consultation" ? activeClass : inactiveClass
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <FileText className="h-5 w-5" />
                {(isOpen || isMobile) && <span>Consultation</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Pied de la sidebar */}
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={handleDeconnexion}
            variant="ghost"
            className={`w-full flex items-center ${!isOpen && !isMobile ? "justify-center" : "justify-start"} ${
              isOpen || isMobile ? "space-x-3" : ""
            } text-gray-600 hover:text-red-600 hover:bg-red-50`}
          >
            <LogOut className="h-5 w-5" />
            {(isOpen || isMobile) && <span>Déconnexion</span>}
          </Button>
        </div>
      </div>
    </>
  )
}
