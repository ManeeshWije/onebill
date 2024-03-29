# One billion rows challenge

## Node

- Using read stream and custom parse int function
- `302.86s user 3.92s system 98% cpu 5:10.98 total`

## Rust

- No optimizations
- `129.90s user 3.27s system 97% cpu 2:16.23 total`

## Conclusion

- Obvious results but will try to explore concurrency and parallelism in Rust to make it go faster
- Bottleneck is reading and parsing the file sequentially
