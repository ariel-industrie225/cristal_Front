"use client"

import type React from "react"

import { useState, useRef } from "react"
import { sauvegarderFichier } from "@/lib/fichiers"
import type { FichierExcel } from "@/lib/types"
import { AlertCircle } from "lucide-react"

export default function UploadFichier() {
  const [fichierSelectionne, setFichierSelectionne] = useState<File | null>(null)
  const [apercu, setApercu] = useState<FichierExcel | null>(null)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState("")
  const [succes, setSucces] = useState(false)
  const [avertissement, setAvertissement] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelectionFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichiers = e.target.files
    if (!fichiers || fichiers.length === 0) return

    const fichier = fichiers[0]

    // Vérification de l'extension
    const extension = fichier.name.split(".").pop()?.toLowerCase()
    if (!["xlsx", "csv", "ods"].includes(extension || "")) {
      setErreur("Seuls les fichiers Excel (.xlsx), CSV (.csv) et ODS (.ods) sont acceptés.")
      setFichierSelectionne(null)
      return
    }

    // Vérification de la taille du fichier
    if (fichier.size > 10 * 1024 * 1024) {
      // 10 Mo
      setAvertissement("Ce fichier est volumineux. L'aperçu pourrait être limité.")
    } else {
      setAvertissement("")
    }

    setFichierSelectionne(fichier)
    setErreur("")
    setSucces(false)
  }

  const handleUpload = async () => {
    if (!fichierSelectionne) return

    setChargement(true)
    setErreur("")
    setSucces(false)

    try {
      const fichierSauvegarde = await sauvegarderFichier(fichierSelectionne)
      setApercu(fichierSauvegarde)
      setSucces(true)

      // Vérifier si l'aperçu est limité
      const contenuJSON = localStorage.getItem(`fichier_${fichierSauvegarde.id}`)
      if (contenuJSON) {
        const contenu = JSON.parse(contenuJSON)
        if (contenu.tailleLimitee) {
          setAvertissement("Le fichier est trop volumineux. L'aperçu a été limité.")
        }
      }

      // Réinitialisation du formulaire
      if (inputRef.current) {
        inputRef.current.value = ""
      }
      setFichierSelectionne(null)
    } catch (error) {
      console.error("Erreur lors du chargement du fichier:", error)
      setErreur(
        "Une erreur est survenue lors du chargement du fichier. Le fichier est peut-être trop volumineux pour être traité dans le navigateur.",
      )
    } finally {
      setChargement(false)
    }
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chargement de fichier de données</h2>

        {erreur && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{erreur}</span>
          </div>
        )}

        {avertissement && (
          <div
            className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 flex items-start"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <span className="block sm:inline">{avertissement}</span>
          </div>
        )}

        {succes && (
          <div
            className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">Fichier chargé avec succès !</span>
          </div>
        )}

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Cliquez pour sélectionner</span> ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">Formats supportés : Excel (.xlsx), CSV (.csv), ODS (.ods)</p>
              <p className="text-xs text-gray-500 mt-1">Taille maximale recommandée : 10 Mo</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".xlsx,.csv,.ods"
              onChange={handleSelectionFichier}
              ref={inputRef}
            />
          </label>
        </div>

        {fichierSelectionne && (
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                {getIconeFormat(fichierSelectionne.name.split(".").pop()?.toLowerCase() || "")}
                <div className="ml-3">
                  <h3 className="font-medium">Fichier sélectionné :</h3>
                  <p className="text-gray-600">{fichierSelectionne.name}</p>
                  <p className="text-gray-600">Taille : {(fichierSelectionne.size / 1024).toFixed(2)} Ko</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={chargement}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {chargement ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Chargement...
                </span>
              ) : (
                "Charger le fichier"
              )}
            </button>
          </div>
        )}
      </div>

      {apercu && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Aperçu du fichier</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              {getIconeFormat(apercu.format)}
              <div className="ml-3">
                <h3 className="font-medium">Nom du fichier :</h3>
                <p className="text-gray-600">{apercu.nom}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Format :</h3>
              <p className="text-gray-600">
                {apercu.format === "xlsx"
                  ? "Excel (.xlsx)"
                  : apercu.format === "csv"
                    ? "CSV (.csv)"
                    : apercu.format === "ods"
                      ? "OpenDocument Spreadsheet (.ods)"
                      : "Inconnu"}
              </p>
            </div>

            <div>
              <h3 className="font-medium">Date de chargement :</h3>
              <p className="text-gray-600">{new Date(apercu.dateUpload).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="font-medium">Taille :</h3>
              <p className="text-gray-600">{apercu.taille}</p>
            </div>

            {apercu.contenu && apercu.contenu.premieresFeuilles ? (
              <div>
                <h3 className="font-medium">Aperçu des données :</h3>

                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {apercu.contenu.premieresFeuilles[0]?.donnees[0]?.map((cellule: any, index: number) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {cellule}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {apercu.contenu.premieresFeuilles[0]?.donnees
                        .slice(1, 5)
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
            ) : apercu.contenu && apercu.contenu.erreur ? (
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                <p>{apercu.contenu.erreur}</p>
                <p className="text-sm mt-2">
                  Le fichier a été importé avec succès, mais son contenu est trop volumineux pour être affiché dans
                  l'aperçu.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
