import { CacheDataLoader } from './cache-data-loader'

test('cache-data-loader', async () => {
  let count = 0

  const loader = new CacheDataLoader((token: string) => {
    return new Promise<string>((resolve) => {
      process.nextTick(() => {
        resolve(token + count)
        count += 1
      })
    })
  })

  await Promise.all([
    loader.load('A').then((result) => expect(result).toBe('A0')),
    loader.load('B').then((result) => expect(result).toBe('B1')),
    loader.load('A').then((result) => expect(result).toBe('A0')),
  ])

  await Promise.all([loader.load('C').then((result) => expect(result).toBe('C2')), loader.load('C').then((result) => expect(result).toBe('C2'))])

  await Promise.all([loader.load('A').then((result) => expect(result).toBe('A3')), loader.load('B').then((result) => expect(result).toBe('B4'))])

  return expect(count).toBe(5)
})
