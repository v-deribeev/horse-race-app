import type { Horse } from './types'
import { randomInt, randomHexColor, createUniqueGenerator } from './random.utils'

const createHorseFactory = () => {
  const generateUniqueColor = createUniqueGenerator(randomHexColor)

  return (index: number): Horse => ({
    id: crypto.randomUUID(), // Added ID for Vue v-for binding
    name: `Horse-${index + 1}`,
    raceColor: generateUniqueColor(),
    conditionScore: randomInt(1, 100),
  })
}

const createListFactory =
  <T>(itemFactory: (index: number) => T) =>
  (length: number): T[] =>
    Array.from({ length }, (_, i) => itemFactory(i))

export const generateHorses = (count: number = 20): Horse[] => {
  const horseFactory = createHorseFactory()
  const listFactory = createListFactory(horseFactory)
  return listFactory(count)
}
