export function* sequence(): IterableIterator<number> {
  let a = 0;

  while (true) {
    yield a;

    a = a + 1;
  }
}