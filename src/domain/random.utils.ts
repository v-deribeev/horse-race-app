export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const randomHexColor = (): string =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`

export const createUniqueGenerator = <T>(generator: () => T) => {
  const used = new Set<T>()

  return (): T => {
    let value: T
    do {
      value = generator()
    } while (used.has(value))

    used.add(value)
    return value
  }
}

export const pickRandom = <T>(array: T[], count: number): T[] =>
  [...array].sort(() => Math.random() - 0.5).slice(0, count)
