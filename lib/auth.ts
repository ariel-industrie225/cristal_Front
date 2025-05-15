"use client"

import type { Utilisateur } from "./types"

// Fonction pour simuler la connexion
export const connexion = async (email: string, motDePasse: string): Promise<Utilisateur | null> => {
  // Récupération des utilisateurs depuis le localStorage
  const utilisateursJSON = localStorage.getItem("utilisateurs")
  const utilisateurs: Utilisateur[] = utilisateursJSON ? JSON.parse(utilisateursJSON) : []

  // Recherche de l'utilisateur
  const utilisateur = utilisateurs.find((u) => u.email === email && u.motDePasse === motDePasse)

  if (utilisateur) {
    // Stockage de l'utilisateur connecté
    localStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateur))
    return utilisateur
  }

  return null
}

// Fonction pour simuler l'inscription
export const inscription = async (email: string, motDePasse: string): Promise<Utilisateur | null> => {
  // Récupération des utilisateurs depuis le localStorage
  const utilisateursJSON = localStorage.getItem("utilisateurs")
  const utilisateurs: Utilisateur[] = utilisateursJSON ? JSON.parse(utilisateursJSON) : []

  // Vérification si l'email existe déjà
  if (utilisateurs.some((u) => u.email === email)) {
    return null
  }

  // Création du nouvel utilisateur
  const nouvelUtilisateur: Utilisateur = {
    id: Date.now().toString(),
    email,
    motDePasse,
  }

  // Ajout de l'utilisateur à la liste
  utilisateurs.push(nouvelUtilisateur)
  localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs))

  // Stockage de l'utilisateur connecté
  localStorage.setItem("utilisateurConnecte", JSON.stringify(nouvelUtilisateur))

  return nouvelUtilisateur
}

// Fonction pour la déconnexion
export const deconnexion = (): void => {
  localStorage.removeItem("utilisateurConnecte")
}

// Fonction pour vérifier si l'utilisateur est connecté
export const verifierConnexion = (): Utilisateur | null => {
  if (typeof window === "undefined") return null

  const utilisateurJSON = localStorage.getItem("utilisateurConnecte")
  return utilisateurJSON ? JSON.parse(utilisateurJSON) : null
}
