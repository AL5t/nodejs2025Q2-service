# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/AL5t/nodejs2025Q2-service
```

## Go to directory

```
cd nodejs2025Q2-service
```

## Adding .env file

```
cp .env.example ./.env
```

## Running application

```
docker compose build --no-cache
```
```
docker compose up -d
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
docker exec -it nodejs2025q2-service-app-1 npm run test
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

