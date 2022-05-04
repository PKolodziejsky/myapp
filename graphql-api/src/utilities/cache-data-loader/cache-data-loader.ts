import * as LRU from 'lru-cache'

type LoaderFunction<K, R> = (key: K) => Promise<R>

interface CacheDataLoaderOptions {
  max: number
}

export class CacheDataLoader<K, R> {
  private processing = new Map<K, Promise<R>>()
  private cache

  constructor(private readonly loaderFunction: LoaderFunction<K, R>, options?: CacheDataLoaderOptions) {
    this.cache = new LRU({
      max: options?.max ?? 1000
    })
  }

  load(key: K, ttl?: number): Promise<R> {
    if (this.cache.has(key)) {
      return new Promise((resolve) => {
        resolve(this.cache.get(key)!)
      })
    }

    if (!this.processing.has(key)) {
      const callback = this.loaderFunction(key).then((result) => {
        this.processing.delete(key)
        this.cache.set(key, result, { ttl })

        return result
      })

      this.processing.set(key, callback)
    }

    return this.processing.get(key)!
  }

  clear() {
    this.cache.clear()
  }
}
