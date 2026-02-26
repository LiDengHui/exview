export interface HttpOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
  body?: unknown
  timeoutMs?: number
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000)
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
    }

    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}
