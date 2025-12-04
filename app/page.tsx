"use client"

import { RedBlackTreeVisualizer, RedBlackTreeVisualizerHandle } from "@/components/red-black-tree-visualizer"
import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { extractSearchParams } from "@/lib/extractSearchParams"

export default function Home() {
  const ref = useRef<RedBlackTreeVisualizerHandle>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!ref.current) return

    const v = searchParams.get("v") ?? searchParams.get("values")
    if (!v) return

    let numbers = extractSearchParams(v, searchParams);
    if (numbers.length > 0) {
      ref.current.insert(numbers)
    }
  }, [searchParams])

  return <RedBlackTreeVisualizer ref={ref} />
}