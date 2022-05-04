interface CreateFetchClientOptions {
  onRequest?: (init?: RequestInit) => Promise<RequestInit | undefined>
  onResponse?: (response: Response) => Promise<Response> | Response
  onError?: (error: unknown) => Promise<unknown> | unknown
}

export const createFetchClient = (options?: CreateFetchClientOptions) => {
  return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (options?.onRequest) {
      init = await options.onRequest(init)
    }

    const promise = fetch(input, init)

    if (options?.onResponse) {
      promise.then(options.onResponse)
    }

    if (options?.onError) {
      promise.catch(options.onError)
    }

    return promise
  }
}
