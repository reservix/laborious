declare namespace jest {
  interface Matchers<T> {
    toMatchLastCallSnapshot(): T;
  }
}
