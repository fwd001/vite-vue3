type long = string | number

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Recordable<T = any> = Record<string, T>

export type { long, Recordable }
