export interface DataOperation<T> {
  operation: 'create' | 'update' | 'delete'
  data: T
}
