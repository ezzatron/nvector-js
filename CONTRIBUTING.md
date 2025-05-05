# Contributing

## Running the tests locally

You'll need to run the `nvector-test-api` Docker container in order to run the
tests locally:

```sh
docker run --rm -it -p 17357:8000 ghcr.io/ezzatron/nvector-test-api
```

Then, in another terminal, you can run the tests with `make`:

```sh
make test
```
