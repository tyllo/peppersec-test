export type Await<T> = T extends {
  // eslint-disable-next-line no-unused-vars
  then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;
