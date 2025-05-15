// Types pour l'application

// Type pour un utilisateur
export type Utilisateur = {
  id: string
  email: string
  motDePasse: string
  nom?: string
}

// Type pour un fichier Excel
export type FichierExcel = {
  id: string
  nom: string
  dateUpload: string
  taille: string
  format: "xlsx" | "csv" | "ods" // Ajout du format du fichier
  contenu?: any // Contenu du fichier après lecture
}

// Type pour le contexte d'authentification
export type ContexteAuth = {
  utilisateur: Utilisateur | null
  estConnecte: boolean
  connexion: (email: string, motDePasse: string) => Promise<boolean>
  inscription: (email: string, motDePasse: string) => Promise<boolean>
  deconnexion: () => void
}
