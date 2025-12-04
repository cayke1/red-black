import { ReadonlyURLSearchParams } from "next/navigation"

export function extractSearchParams(v: string, searchParams: ReadonlyURLSearchParams) {
    let numbers: number[] = []

    if (v.startsWith("[") && v.endsWith("]")) {
      try {
        const parsed = JSON.parse(v)
        if (Array.isArray(parsed)) {
          numbers = parsed.filter(n => typeof n === "number" && !isNaN(n))
        }
      } catch {
      }
    }
    if (numbers.length === 0) {
      numbers = v
        .split(/[,;\s]+/)
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n) && n != null)
    }
    if (numbers.length === 0) {
      const allParams = Array.from(searchParams.entries())
      numbers = allParams
        .filter(([key]) => !["v", "values"].includes(key))
        .map(([, val]) => Number(val))
        .filter(n => !isNaN(n))
    }

    return numbers;
}