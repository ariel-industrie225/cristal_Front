"use client"

import type { FichierExcel } from "./types"
import * as XLSX from "xlsx"

// Fonction pour déterminer le format du fichier
const determinerFormat = (nomFichier: string): "xlsx" | "csv" | "ods" => {
  const extension = nomFichier.split(".").pop()?.toLowerCase()

  if (extension === "csv") return "csv"
  if (extension === "ods") return "ods"
  return "xlsx" // Par défaut, on considère que c'est un fichier Excel
}

// Fonction pour sauvegarder un fichier dans le localStorage
export const sauvegarderFichier = (fichier: File): Promise<FichierExcel> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const format = determinerFormat(fichier.name)

    reader.onload = (e) => {
      try {
        let data: any
        let workbook: XLSX.WorkBook

        // Traitement selon le format
        if (format === "csv") {
          // Pour CSV, on lit comme texte puis on parse
          const csvString = e.target?.result as string
          workbook = XLSX.read(csvString, { type: "string" })
        } else {
          // Pour Excel et ODS, on lit comme ArrayBuffer
          data = new Uint8Array(e.target?.result as ArrayBuffer)
          workbook = XLSX.read(data, { type: "array" })
        }

        // Création de l'objet fichier
        const nouveauFichier: FichierExcel = {
          id: Date.now().toString(),
          nom: fichier.name,
          dateUpload: new Date().toISOString(),
          taille: formatTaille(fichier.size),
          format: format,
          contenu: workbook,
        }

        // Récupération des fichiers existants
        const fichiersJSON = localStorage.getItem("fichiers")
        const fichiers: FichierExcel[] = fichiersJSON ? JSON.parse(fichiersJSON) : []

        // Ajout du nouveau fichier
        fichiers.push(nouveauFichier)
        localStorage.setItem(
          "fichiers",
          JSON.stringify(
            fichiers.map((f) => ({
              ...f,
              contenu: undefined, // On ne stocke pas le contenu complet dans localStorage
            })),
          ),
        )

        // Extraction d'un aperçu limité et du contenu textuel pour la recherche
        const apercu = extraireApercu(workbook)
        const contenuTextuel = extraireContenuTextuelLimite(workbook)

        try {
          // Stockage séparé du contenu avec gestion d'erreur
          localStorage.setItem(
            `fichier_${nouveauFichier.id}`,
            JSON.stringify({
              feuilles: workbook.SheetNames,
              premieresFeuilles: apercu,
              contenuTextuel: contenuTextuel,
            }),
          )
        } catch (storageError) {
          console.error("Erreur de stockage:", storageError)

          // En cas d'erreur de quota, on stocke une version encore plus réduite
          try {
            localStorage.setItem(
              `fichier_${nouveauFichier.id}`,
              JSON.stringify({
                feuilles: workbook.SheetNames.slice(0, 3),
                premieresFeuilles: apercu.slice(0, 1).map((feuille) => ({
                  ...feuille,
                  donnees: feuille.donnees
                    .slice(0, 5)
                    .map((ligne) => (Array.isArray(ligne) ? ligne.slice(0, 5) : ligne)),
                })),
                contenuTextuel: contenuTextuel.substring(0, 1000), // Limiter à 1000 caractères
                tailleLimitee: true, // Indicateur que les données sont limitées
              }),
            )
          } catch (fallbackError) {
            // Si même la version réduite échoue, on stocke juste les métadonnées
            localStorage.setItem(
              `fichier_${nouveauFichier.id}`,
              JSON.stringify({
                feuilles: workbook.SheetNames.slice(0, 3),
                tailleLimitee: true,
                erreur: "Fichier trop volumineux pour l'aperçu",
              }),
            )
          }
        }

        resolve(nouveauFichier)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => reject(error)

    // Lecture du fichier selon son format
    if (format === "csv") {
      reader.readAsText(fichier)
    } else {
      reader.readAsArrayBuffer(fichier)
    }
  })
}

// Fonction pour extraire un aperçu limité du workbook
const extraireApercu = (workbook: XLSX.WorkBook) => {
  // Limiter le nombre de feuilles, lignes et colonnes pour l'aperçu
  return workbook.SheetNames.slice(0, 2).map((nom) => {
    const donnees = XLSX.utils.sheet_to_json(workbook.Sheets[nom], { header: 1 }) as any[][]
    // Limiter à 10 lignes et 10 colonnes par ligne
    return {
      nom,
      donnees: donnees.slice(0, 10).map((ligne) => (Array.isArray(ligne) ? ligne.slice(0, 10) : ligne)),
    }
  })
}

// Fonction pour extraire le contenu textuel limité d'un workbook pour la recherche
const extraireContenuTextuelLimite = (workbook: XLSX.WorkBook): string => {
  let contenuTextuel = ""
  let totalCellules = 0
  const MAX_CELLULES = 1000 // Limiter le nombre de cellules à traiter

  // Parcourir chaque feuille
  for (const sheetName of workbook.SheetNames) {
    if (totalCellules >= MAX_CELLULES) break

    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    // Parcourir les lignes et colonnes pour extraire le texte
    for (const row of data) {
      if (totalCellules >= MAX_CELLULES) break

      if (Array.isArray(row)) {
        for (const cell of row) {
          if (totalCellules >= MAX_CELLULES) break

          if (cell !== null && cell !== undefined) {
            contenuTextuel += cell.toString() + " "
            totalCellules++
          }
        }
      }
    }
  }

  return contenuTextuel.toLowerCase()
}

// Fonction pour récupérer tous les fichiers
export const recupererFichiers = (): FichierExcel[] => {
  if (typeof window === "undefined") return []

  const fichiersJSON = localStorage.getItem("fichiers")
  return fichiersJSON ? JSON.parse(fichiersJSON) : []
}

// Fonction pour récupérer un fichier par son ID
export const recupererFichierParId = (id: string): FichierExcel | null => {
  const fichiers = recupererFichiers()
  const fichier = fichiers.find((f) => f.id === id)

  if (fichier) {
    // Récupération du contenu
    const contenuJSON = localStorage.getItem(`fichier_${id}`)
    if (contenuJSON) {
      fichier.contenu = JSON.parse(contenuJSON)
    }
  }

  return fichier
}

// Fonction pour supprimer un fichier
export const supprimerFichier = (id: string): void => {
  const fichiers = recupererFichiers()
  const nouveauxFichiers = fichiers.filter((f) => f.id !== id)

  localStorage.setItem("fichiers", JSON.stringify(nouveauxFichiers))
  localStorage.removeItem(`fichier_${id}`)
}

// Fonction pour rechercher des fichiers
export const rechercherFichiers = (query: string, type: "nom" | "contenu"): FichierExcel[] => {
  if (!query.trim()) return recupererFichiers()

  const fichiers = recupererFichiers()
  const queryLower = query.toLowerCase()

  if (type === "nom") {
    // Recherche par nom de fichier
    return fichiers.filter((fichier) => fichier.nom.toLowerCase().includes(queryLower))
  } else {
    // Recherche dans le contenu
    return fichiers.filter((fichier) => {
      const contenuJSON = localStorage.getItem(`fichier_${fichier.id}`)
      if (!contenuJSON) return false

      const contenu = JSON.parse(contenuJSON)
      return contenu.contenuTextuel && contenu.contenuTextuel.includes(queryLower)
    })
  }
}

// Fonction pour formater la taille du fichier
const formatTaille = (taille: number): string => {
  if (taille < 1024) {
    return `${taille} octets`
  } else if (taille < 1024 * 1024) {
    return `${(taille / 1024).toFixed(2)} Ko`
  } else {
    return `${(taille / (1024 * 1024)).toFixed(2)} Mo`
  }
}
