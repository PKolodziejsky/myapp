import {hashKey} from "./key";

describe('object hash', () => {
  test('sort', () => {
    expect(
        hashKey({
          b: 1,
          a: 2,
        })
    ).toEqual(
        hashKey({
          a: 2,
          b: 1,
        })
    )

    expect(
        hashKey({
          b: 1,
          a: {
            c: 3,
          },
        })
    ).toEqual(
        hashKey({
          a: {
            c: 3,
          },
          b: 1,
        })
    )

    expect(
        hashKey({
          b: 1,
          a: 2,
        })
    ).not.toEqual(
        hashKey({
          a: 2,
        })
    )
  })
})
