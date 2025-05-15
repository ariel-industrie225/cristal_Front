"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RechercheProps {
  onSearch: (query: string, type: "nom" | "contenu") => void
}

export default function RechercheFichiers({ onSearch }: RechercheProps) {
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<"nom" | "contenu">("nom")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query, searchType)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("", searchType)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">Rechercher des fichiers</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Réduire" : "Options avancées"}
        </Button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Rechercher un fichier..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 w-full"
          />
          {query && (
            <button type="button" onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="p-4 bg-gray-50 rounded-md">
            <RadioGroup
              value={searchType}
              onValueChange={(value) => setSearchType(value as "nom" | "contenu")}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nom" id="nom" />
                <Label htmlFor="nom" className="cursor-pointer">
                  Rechercher par nom de fichier
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contenu" id="contenu" />
                <Label htmlFor="contenu" className="cursor-pointer">
                  Rechercher dans le contenu
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-3 text-sm text-gray-500">
              <p>
                {searchType === "nom"
                  ? "La recherche s'effectuera uniquement sur les noms des fichiers."
                  : "La recherche s'effectuera dans le contenu des fichiers. Cela peut prendre plus de temps."}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
            Rechercher
          </Button>
        </div>
      </form>
    </div>
  )
}
