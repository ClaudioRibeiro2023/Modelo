import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
} from '../formatters'

describe('Formatters', () => {
  describe('formatNumber', () => {
    it('should format number with thousands separator (pt-BR)', () => {
      expect(formatNumber(1000)).toBe('1.000')
      expect(formatNumber(1000000)).toBe('1.000.000')
    })

    it('should format decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1.234,56')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1.000')
    })

    it('should use custom locale', () => {
      expect(formatNumber(1000, 'en-US')).toBe('1,000')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in BRL', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('1.000')
      expect(result).toContain('R$')
    })

    it('should handle decimals', () => {
      const result = formatCurrency(1234.56)
      expect(result).toContain('1.234,56')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('should use custom currency', () => {
      const result = formatCurrency(1000, 'USD', 'en-US')
      expect(result).toContain('$')
      expect(result).toContain('1,000')
    })
  })

  describe('formatPercent', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercent(50)).toBe('50.0%')
      expect(formatPercent(33.333)).toBe('33.3%')
    })

    it('should format percentage with custom decimals', () => {
      expect(formatPercent(33.333, 2)).toBe('33.33%')
      expect(formatPercent(100, 0)).toBe('100%')
    })

    it('should handle zero', () => {
      expect(formatPercent(0)).toBe('0.0%')
    })

    it('should handle negative percentages', () => {
      expect(formatPercent(-10)).toBe('-10.0%')
    })
  })

  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date(2024, 0, 15) // Jan 15, 2024
      const result = formatDate(date)
      expect(result).toContain('15')
      expect(result).toContain('01')
      expect(result).toContain('2024')
    })

    it('should format date string', () => {
      // Use ISO format with time to avoid timezone issues
      const result = formatDate('2024-01-15T12:00:00')
      expect(result).toContain('15')
      expect(result).toContain('01')
      expect(result).toContain('2024')
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date(2024, 0, 15, 14, 30) // Jan 15, 2024 14:30
      const result = formatDateTime(date)
      expect(result).toContain('15')
      expect(result).toContain('14')
      expect(result).toContain('30')
    })

    it('should format date string with time', () => {
      const result = formatDateTime('2024-01-15T14:30:00')
      expect(result).toContain('15')
    })
  })
})
