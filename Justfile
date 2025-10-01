lint:
    bun run lint

build:
    rm -rf dist
    bun run build

push: build
    cp appsscript.json dist/
    clasp push
