import { useState, useCallback } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'

export interface TerritoryScope {
  type: 'STATE' | 'MUNICIPIO'
  id: string
  name?: string
}

const UF_LIST = [
  { id: 'MG', name: 'Minas Gerais' },
  { id: 'SP', name: 'São Paulo' },
  { id: 'RJ', name: 'Rio de Janeiro' },
  { id: 'BA', name: 'Bahia' },
  { id: 'PR', name: 'Paraná' },
  { id: 'RS', name: 'Rio Grande do Sul' },
  { id: 'PE', name: 'Pernambuco' },
  { id: 'CE', name: 'Ceará' },
  { id: 'PA', name: 'Pará' },
  { id: 'MA', name: 'Maranhão' },
]

interface TerritoryFilterProps {
  value: TerritoryScope
  onChange: (scope: TerritoryScope) => void
  className?: string
}

export function TerritoryFilter({ value, onChange, className = '' }: TerritoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = useCallback(
    (uf: { id: string; name: string }) => {
      onChange({ type: 'STATE', id: uf.id, name: uf.name })
      setIsOpen(false)
    },
    [onChange]
  )

  const currentUf = UF_LIST.find(uf => uf.id === value.id) || UF_LIST[0]

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <MapPin className="w-4 h-4 text-brand-primary" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">{currentUf.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 uppercase">
                Selecionar UF
              </p>
              {UF_LIST.map(uf => (
                <button
                  key={uf.id}
                  onClick={() => handleSelect(uf)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    uf.id === value.id
                      ? 'bg-brand-primary/10 text-brand-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {uf.name} ({uf.id})
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TerritoryFilter
