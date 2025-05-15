"use client"

import { useState, useEffect } from "react"
import { recupererFichiers, supprimerFichier, recupererFichierParId, rechercherFichiers } from "@/lib/fichiers"
import type { FichierExcel } from "@/lib/types"
import * as XLSX from "xlsx"
import RechercheFichiers from "./recherche-fichiers"
import { AlertCircle } from "lucide-react"

export default function ListeFichiers() {
  const [fichiers, setFichiers] = useState<FichierExcel[]>([])
  const [fichiersFiltres, setFichiersFiltres] = useState<FichierExcel[]>([])
  const [fichierSelectionne, setFichierSelectionne] = useState<FichierExcel | null>(null)
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState("")
  const [typeRecherche, setTypeRecherche] = useState<"nom" | "contenu">("nom")
  const [rechercheEnCours, setRechercheEnCours] = useState(false)

  useEffect(() => {
    // Récupération des fichiers au chargement du composant
    const chargerFichiers = () => {
      const fichiers = recupererFichiers()
      setFichiers(fichiers)
      setFichiersFiltres(fichiers)
      setChargement(false)
    }

    chargerFichiers()
  }, [])

  const handleVoir = (id: string) => {
    const fichier = recupererFichierParId(id)
    setFichierSelectionne(fichier)
  }

  const handleTelecharger = (id: string) => {
    const fichier = recupererFichierParId(id)
    if (!fichier || !fichier.contenu) return

    try {
      // Création d'un workbook vide
      const wb = XLSX.utils.book_new()

      // Pour chaque feuille dans l'aperçu, créer une feuille dans le workbook
      if (fichier.contenu.premieresFeuilles) {
        fichier.contenu.premieresFeuilles.forEach((feuille: any) => {
          const ws = XLSX.utils.aoa_to_sheet(feuille.donnees)
          XLSX.utils.book_append_sheet(wb, ws, feuille.nom)
        })

        // Téléchargement du fichier avec son extension d'origine
        XLSX.writeFile(wb, fichier.nom)
      } else {
        alert("Impossible de télécharger ce fichier. Les données complètes ne sont pas disponibles.")
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      alert("Une erreur est survenue lors du téléchargement du fichier.")
    }
  }

  const handleSupprimer = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      supprimerFichier(id)

      // Mettre à jour les deux listes de fichiers
      const nouveauxFichiers = fichiers.filter((f) => f.id !== id)
      setFichiers(nouveauxFichiers)
      setFichiersFiltres(
        nouveauxFichiers.filter((f) =>
          recherche ? (typeRecherche === "nom" ? f.nom.toLowerCase().includes(recherche.toLowerCase()) : true) : true,
        ),
      )

      if (fichierSelectionne && fichierSelectionne.id === id) {
        setFichierSelectionne(null)
      }
    }
  }

  const handleSearch = (query: string, type: "nom" | "contenu") => {
    setRecherche(query)
    setTypeRecherche(type)

    if (!query.trim()) {
      setFichiersFiltres(fichiers)
      return
    }

    setRechercheEnCours(true)

    // Utiliser setTimeout pour éviter de bloquer l'interface utilisateur
    // pendant la recherche dans le contenu qui peut être intensive
    setTimeout(() => {
      const resultats = rechercherFichiers(query, type)
      setFichiersFiltres(resultats)
      setRechercheEnCours(false)
    }, 100)
  }

  // Fonction pour obtenir l'icône selon le format du fichier
  const getIconeFormat = (format: string) => {
    switch (format) {
      case "xlsx":
        return (
          <svg
            className="w-6 h-6 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "csv":
        return (
          <svg
            className="w-6 h-6 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "ods":
        return (
          <svg
            className="w-6 h-6 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return (
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  // Fonction pour obtenir le nom du format
  const getNomFormat = (format: string) => {
    switch (format) {
      case "xlsx":
        return "Excel (.xlsx)"
      case "csv":
        return "CSV (.csv)"
      case "ods":
        return "OpenDocument (.ods)"
      default:
        return "Inconnu"
    }
  }

  if (chargement) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Composant de recherche */}
      <RechercheFichiers onSearch={handleSearch} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des fichiers importés</h2>
          {recherche && (
            <div className="text-sm text-gray-500">
              {rechercheEnCours ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-violet-600 rounded-full mr-2"></div>
                  Recherche en cours...
                </div>
              ) : (
                <span>
                  {fichiersFiltres.length} résultat{fichiersFiltres.length !== 1 ? "s" : ""} pour "{recherche}"
                </span>
              )}
            </div>
          )}
        </div>

        {fichiers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun fichier n'a été chargé.</p>
            <p className="mt-2">Rendez-vous sur la page de chargement pour ajouter des fichiers.</p>
          </div>
        ) : fichiersFiltres.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun fichier ne correspond à votre recherche.</p>
            <button
              onClick={() => handleSearch("", typeRecherche)}
              className="mt-2 text-violet-600 hover:text-violet-700 font-medium"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <div className="overflow-hidden md:rounded-lg">
                {/* Version mobile: liste de cartes */}
                <div className="md:hidden space-y-4">
                  {fichiersFiltres.map((fichier) => (
                    <div key={fichier.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-3">
                        {getIconeFormat(fichier.format || "unknown")}
                        <span className="ml-2 font-medium text-gray-900">{fichier.nom}</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-500 mb-3">
                        <p>Format: {getNomFormat(fichier.format || "unknown")}</p>
                        <p>Date: {new Date(fichier.dateUpload).toLocaleString()}</p>
                        <p>Taille: {fichier.taille}</p>
                      </div>
                      <div className="flex space-x-2 pt-2 border-t">
                        <button
                          onClick={() => handleVoir(fichier.id)}
                          className="flex-1 text-center py-2 text-blue-600 hover:text-blue-800"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => handleTelecharger(fichier.id)}
                          className="flex-1 text-center py-2 text-green-600 hover:text-green-800"
                        >
                          Télécharger
                        </button>
                        <button
                          onClick={() => handleSupprimer(fichier.id)}
                          className="flex-1 text-center py-2 text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Version desktop: tableau */}
                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fichier
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Format
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date de chargement
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Taille
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fichiersFiltres.map((fichier) => (
                      <tr key={fichier.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getIconeFormat(fichier.format || "unknown")}
                            <span className="ml-2 font-medium text-gray-900">{fichier.nom}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getNomFormat(fichier.format || "unknown")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(fichier.dateUpload).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fichier.taille}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleVoir(fichier.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Voir
                          </button>
                          <button
                            onClick={() => handleTelecharger(fichier.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Télécharger
                          </button>
                          <button
                            onClick={() => handleSupprimer(fichier.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {fichierSelectionne && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Aperçu du fichier : {fichierSelectionne.nom}</h2>
            <button onClick={() => setFichierSelectionne(null)} className="text-gray-500 hover:text-gray-700">
              Fermer
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              {getIconeFormat(fichierSelectionne.format || "unknown")}
              <div className="ml-3">
                <h3 className="font-medium">Format :</h3>
                <p className="text-gray-600">{getNomFormat(fichierSelectionne.format || "unknown")}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Date de chargement :</h3>
              <p className="text-gray-600">{new Date(fichierSelectionne.dateUpload).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="font-medium">Taille :</h3>
              <p className="text-gray-600">{fichierSelectionne.taille}</p>
            </div>

            {fichierSelectionne.contenu && fichierSelectionne.contenu.tailleLimitee && (
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Aperçu limité</p>
                  <p className="text-sm mt-1">
                    Ce fichier est volumineux. Seul un aperçu limité est disponible pour éviter de surcharger le
                    navigateur.
                  </p>
                </div>
              </div>
            )}

            {fichierSelectionne.contenu && fichierSelectionne.contenu.premieresFeuilles ? (
              <div>
                <h3 className="font-medium">Aperçu des données :</h3>

                <div className="mt-2 overflow-x-auto -mx-6">
                  <div className="inline-block min-w-full align-middle px-6">
                    <div className="overflow-hidden md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {fichierSelectionne.contenu.premieresFeuilles[0]?.donnees[0]?.map(
                              (cellule: any, index: number) => (
                                <th
                                  key={index}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {cellule}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {fichierSelectionne.contenu.premieresFeuilles[0]?.donnees
                            .slice(1)
                            .map((ligne: any, indexLigne: number) => (
                              <tr key={indexLigne}>
                                {ligne.map((cellule: any, indexCellule: number) => (
                                  <td key={indexCellule} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cellule}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : fichierSelectionne.contenu && fichierSelectionne.contenu.erreur ? (
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                <p>{fichierSelectionne.contenu.erreur}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
