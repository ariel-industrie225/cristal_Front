import ListeFichiers from "@/components/fichiers/ListeFichiers"

export default function ConsultationPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Consultation des fichiers importés</h1>
        <p className="text-gray-600">Consultez, téléchargez ou supprimez vos fichiers importés (Excel, CSV, ODS).</p>
      </div>

      <ListeFichiers />
    </div>
  )
}
