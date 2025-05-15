import UploadFichier from "@/components/fichiers/UploadFichier"

export default function ChargementPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Importation de données</h1>
        <p className="text-gray-600">
          Importez vos données depuis différents formats de fichiers : Excel (.xlsx), CSV (.csv) ou OpenDocument
          Spreadsheet (.ods).
        </p>
      </div>

      <UploadFichier />
    </div>
  )
}
