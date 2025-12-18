interface BarItem {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: BarItem[]
  maxValue?: number
  height?: number
  showValues?: boolean
  className?: string
}

export function SimpleBarChart({
  data,
  maxValue,
  height = 200,
  showValues = true,
  className = '',
}: SimpleBarChartProps) {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1)

  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((item, idx) => {
        const barHeight = (item.value / max) * 100
        const defaultColors = [
          'bg-brand-primary',
          'bg-blue-500',
          'bg-green-500',
          'bg-amber-500',
          'bg-purple-500',
          'bg-cyan-500',
          'bg-red-500',
          'bg-pink-500',
        ]
        const color = item.color || defaultColors[idx % defaultColors.length]

        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end flex-1">
              {showValues && (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {item.value.toLocaleString('pt-BR')}
                </span>
              )}
              <div
                className={`w-full rounded-t-md ${color} transition-all duration-300`}
                style={{ height: `${barHeight}%`, minHeight: barHeight > 0 ? '4px' : '0' }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full text-center">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default SimpleBarChart
