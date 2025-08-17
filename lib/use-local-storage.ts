"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T, debounceMs = 300) {
  // Cache to prevent repeated JSON parsing
  const [cachedValue, setCachedValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Debounced setter to prevent excessive localStorage writes
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(cachedValue) : value
        setCachedValue(valueToStore)

        // Clear existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        // Set new debounced timeout
        const newTimeoutId = setTimeout(() => {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }, debounceMs)

        setTimeoutId(newTimeoutId)
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, cachedValue, timeoutId, debounceMs],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return [cachedValue, setValue] as const
}
