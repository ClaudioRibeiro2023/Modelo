import type { ExampleItem } from '../types'

interface ExampleCardProps {
  item: ExampleItem
  onClick?: (item: ExampleItem) => void
}

export function ExampleCard({ item, onClick }: ExampleCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }

  return (
    <div
      className="bg-surface-elevated rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-primary transition-colors cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text-primary">{item.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
          {item.status}
        </span>
      </div>
      <p className="text-text-secondary text-sm mb-3">{item.description}</p>
      <p className="text-text-muted text-xs">
        Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
      </p>
    </div>
  )
}
