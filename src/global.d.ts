declare namespace jest {
  interface Matchers<R> {
    toMatchLastCallSnapshot(): R;
  }
}
