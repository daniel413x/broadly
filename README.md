# Broadly Front-End Client
**Author:** Daniel Maramba

## Prerequisites

### Environment variables

The following environment variables must be defined:

```bash
NEXT_PUBLIC_APP_URL=VALUE     # e.g. http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=VALUE  # e.g. localhost:3000
NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING="false"  # "true" if the project has a domain to its name and subdomain routing is configured correctly
DATABASE_URI=VALUE     # a MongoDB connection string, e.g. "mongodb+srv://USERNAME:PASSWORD@HOST/DB"
PAYLOAD_SECRET=VALUE # Found in the Payload dashboard
STRIPE_SECRET_KEY=VALUE # Found in the Stripe dashboard
STRIPE_WEBHOOK_SECRET=VALUE # Found in the Stripe dashboard
STRIPE_ACCOUNT=VALUE  # Found in the Stripe dashboard
BLOB_READ_WRITE_TOKEN=VALUE # Generated in the Vercel dashboard
```

## Local development

### Run the local development server

Start the local development server:

```bash
bun run dev
```

## Unit tests  

Unit testing for the project is written in the Vitest framework.

### Running tests

Run the command:

```bash
bun run test
```

## Docker

### Manage environmental variables

It is recommended to prepare a file `.development.env` or `.production.env` containing all environmental variables listed in the *Prerequisites* section. This file can be used as a Docker BuildKit secret.

### Build the image

Run the command (development image example):

```bash
DOCKER_BUILDKIT=1 docker build --secret id=env,src=.env.development -t daniel413x/broadly-client:dev -f ./Dockerfile.dev .
```
