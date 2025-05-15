"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link";

interface Fichier {
  id: string;
  nom: string;
  dateUpload: string;
  taille: string;
}

interface StatistiqueDetails {
  fichiersCharges: number;
  espaceUtilise: string; // ex: "15 Mo"
}

interface Activite {
  id: string;
  description: string;
  date: string;
}

export default function DashboardPage() {
  const [utilisateur, setUtilisateur] = useState<any>(null)
  const [fichiersRecents, setFichiersRecents] = useState<Fichier[]>([])
  const [statistiques, setStatistiques] = useState<StatistiqueDetails>({ fichiersCharges: 0, espaceUtilise: "0 Mo" })
  const [activiteRecente, setActiviteRecente] = useState<Activite[]>([])
  const router = useRouter()

  useEffect(() => {
    const utilisateurConnecte = localStorage.getItem("utilisateurConnecte")

    if (!utilisateurConnecte) {
      router.push("/")
      return
    }

    setUtilisateur(JSON.parse(utilisateurConnecte))

    // Simuler la récupération de données dynamiques
    // Dans une vraie application, ces données viendraient d'un API ou localStorage plus structuré
    const mockFichiers: Fichier[] = [
      { id: "1", nom: "rapport_annuel.pdf", dateUpload: "2024-07-20", taille: "2.5 Mo" },
      { id: "2", nom: "presentation_projet.pptx", dateUpload: "2024-07-18", taille: "5.1 Mo" },
    ];
    const mockStatistiques: StatistiqueDetails = {
      fichiersCharges: 2,
      espaceUtilise: "7.6 Mo",
    };
    const mockActivite: Activite[] = [
      { id: "a1", description: "Fichier 'rapport_annuel.pdf' chargé.", date: "2024-07-20" },
      { id: "a2", description: "Connexion au tableau de bord.", date: "2024-07-21" },
    ];

    setFichiersRecents(mockFichiers);
    setStatistiques(mockStatistiques);
    setActiviteRecente(mockActivite);

  }, [router])

  if (!utilisateur) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tableau de bord</h1>
        <p className="text-gray-600">
          Bienvenue, <span className="font-medium">{utilisateur.nom || utilisateur.email}</span> !
        </p>
        <p className="text-gray-600 mt-2">
          Cette page est protégée et n&apos;est accessible qu&apos;aux utilisateurs connectés.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Fichiers récents</h2>
          {fichiersRecents.length > 0 ? (
            <ul className="space-y-2">
              {fichiersRecents.map((fichier) => (
                <li key={fichier.id} className="text-sm text-gray-600">
                  {fichier.nom} ({fichier.taille}) - {fichier.dateUpload}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Vous n&apos;avez pas encore chargé de fichiers.</p>
          )}
          <Link className="mt-4 text-sm text-violet-600 hover:text-violet-700 font-medium" href={"/dashboard/chargement"}>
            Charger un fichier →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Statistiques</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Fichiers chargés</span>
              <span className="font-medium">{statistiques.fichiersCharges}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Espace utilisé</span>
              <span className="font-medium">{statistiques.espaceUtilise}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Activité récente</h2>
          {activiteRecente.length > 0 ? (
            <ul className="space-y-2">
              {activiteRecente.map((activite) => (
                <li key={activite.id} className="text-sm text-gray-600">
                  {activite.description} - {activite.date}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Aucune activité récente à afficher.</p>
          )}
        </div>
      </div>
    </div>
  )
}
