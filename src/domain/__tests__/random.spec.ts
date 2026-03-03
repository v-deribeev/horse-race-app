import { describe, it, expect, vi, afterEach } from 'vitest'
import { randomInt, randomHexColor, createUniqueGenerator, pickRandom } from '../random.utils'

describe('Utils: Random', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('randomInt', () => {
    it('generates a number strictly within the specified range', () => {
      const randomSpy = vi.spyOn(Math, 'random')

      // Test lower boundary
      randomSpy.mockReturnValue(0)
      expect(randomInt(1, 10)).toBe(1)

      // Test upper boundary
      randomSpy.mockReturnValue(0.999999)
      expect(randomInt(1, 10)).toBe(10)

      // Test middle
      randomSpy.mockReturnValue(0.5)
      expect(randomInt(1, 10)).toBe(6)
    })

    it('handles edge cases where min equals max', () => {
      expect(randomInt(5, 5)).toBe(5)
    })
  })

  describe('randomHexColor', () => {
    it('generates a valid padded hex color at the lowest bound', () => {
      // If random is 0, it should be heavily padded to #000000
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomHexColor()).toBe('#000000')
    })

    it('generates a valid hex color at the highest bound', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99999999)
      expect(randomHexColor()).toBe('#ffffff')
    })
  })

  describe('createUniqueGenerator', () => {
    it('prevents duplicate values from being generated', () => {
      // We create a fake generator that intentionally tries to yield duplicates: 1, then 1 again, then 2.
      const mockGenerator = vi
        .fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(1) // duplicate!
        .mockReturnValueOnce(2)

      const uniqueGen = createUniqueGenerator(mockGenerator)

      // First call should get the first 1
      expect(uniqueGen()).toBe(1)

      // Second call should reject the second 1, loop, and return the 2
      expect(uniqueGen()).toBe(2)

      // The inner mock generator should have been called 3 times total to yield 2 valid unique results
      expect(mockGenerator).toHaveBeenCalledTimes(3)
    })
  })

  describe('pickRandom', () => {
    it('picks the exact number of elements requested', () => {
      const sourceArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = pickRandom(sourceArray, 3)

      expect(result.length).toBe(3)
    })

    it('only picks elements that exist in the original array', () => {
      const sourceArray = ['A', 'B', 'C']
      const result = pickRandom(sourceArray, 2)

      result.forEach((item) => {
        expect(sourceArray).toContain(item)
      })
    })

    it('does not mutate the original array', () => {
      const sourceArray = [1, 2, 3]
      pickRandom(sourceArray, 2)

      // Length and contents of source should remain untouched
      expect(sourceArray.length).toBe(3)
      expect(sourceArray).toEqual([1, 2, 3])
    })
  })
})
