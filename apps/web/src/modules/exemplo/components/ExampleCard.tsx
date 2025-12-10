import type { ExampleItem } from '../types'

interface ExampleCardProps {
  item: ExampleItem
  onClick?: (item: ExampleItem) => void
}

export function ExampleCard({ item, onClick }: ExampleCardProps) {
  const statusColors = {
    active: 'bg-color-success/10 text-color-success',
    inactive: 'bg-surface-muted text-text-muted',
    pending: 'bg-color-warning/10 text-color-warning',
  }

  return (
    <div
      className="bg-surface-elevated rounded-xl p-6 border border-border-default hover:border-brand-primary transition-colors cursor-pointer hover-lift"
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
