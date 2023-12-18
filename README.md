# Table of Contents

1. [Main Backend](#1-main-backend)

   1.1 [Working with database](#11-working-with-database)

2. [Project general](#2-project-general)

Some text
{: #hello-world}

<h1 id="1-main-backend">1. Main Backend <a href="#table-of-contents">🔼</a></h1>

<h2 id="1.1-working-with-database">1.1 Working with database <a href="#table-of-contents">🔼</a></h2>

### To run migration {#run-migration}

Run migration at the project root directory.

`knex migrate:make create_volunteers_table --knexfile knexfile.cjs`

`knex migrate:latest --knexfile knexfile.cjs`

`knex migrate:latest --knexfile knexfile.cjs --env=test`

`knex migrate:up --knexfile knexfile.cjs`

`knex migrate:down --knexfile knexfile.cjs`

### Introspecting the database

Run this command in the `packages/backend` directory.

`pnpm run db:introspect`

It will automatically updates `packages/backend/src/core/schema.ts` to the latest schema based on the latest tables of the database.

<h1 id="2-project-general">2. Project General <a href="#table-of-contents">🔼</a></h1>

### Requirements

- NVM or node v18.12.1
- pnpm v7.15.0

### Setup

Environment variables need to be setup.

```bash
# From ./ (root directory)

# React Frontend
cp ./packages/react/.env.local.example ./packages/react/.env.local;

# tRPC Backend
cp ./packages/trpc/.env.example ./packages/trpc/.env;
```

Install & start entire application:

```bash
pnpm install;
pnpm run dev;
```
