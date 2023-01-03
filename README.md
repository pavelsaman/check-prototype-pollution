## Check prototype pollution in JS libraries

## Usage

1. install JS libraries you want to test:

```sh
$ npm init -y
$ npm install json5 lodash
```

2. run `./find-pollution.sh` with those libraries as arguments:

```sh
$ ./find-pollution.sh [library_name...]
```

## Notes

Based on [prototype-pollution-nsec18](https://github.com/HoLyVieR/prototype-pollution-nsec18) repo.

This check is not 100 % correct, but it's a good enough heuristic.
