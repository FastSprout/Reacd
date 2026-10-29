# Local documentation development

Documentation uses MkDocs with Python 3.13 and pinned dependencies. It is separate from
the application runtime and does not add Python to the browser application.

## Install the tools

```sh
uv venv .venv-docs
uv pip install --python .venv-docs/bin/python -r requirements-docs.txt
```

## Build

```sh
npm run docs:check
```

The generated site is written to `site/`, which is ignored by Git. The same strict build
runs before browser acceptance in `npm run check`. Missing tools or documentation
warnings fail the main check. CI prepares the same virtual environment from
`requirements-docs.txt`; it does not deploy the generated output.

## Preview

```sh
npm run docs:check
.venv-docs/bin/python -m http.server 8000 --bind 127.0.0.1 -d site
```

Open `http://127.0.0.1:8000/`. The server binds only to the local machine. Run the build
again after editing documentation. It compiles and copies live-preview assets into the
generated site; MkDocs' standalone serve/rebuild path does not.

## Canonical URL

`mkdocs.yml` sets `site_url` to `https://reacd.dev/`. This defines canonical links in
the generated site. It does not register a domain, configure certificates, change DNS,
or publish the generated files.

There is no documentation deployment command in this local workflow.
