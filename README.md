# TourPlannerApp

## Infrastructure

```
src
| -- app
    |-- core
        |-- api
        |-- dtos
        |-- facades
        |-- guards
        |-- models
    |-- features
        |-- dashboard
            |-- components
        |-- auth
            |-- login
            |--register
    |-- shared
        |-- ui-components
    |-- app.html
    |-- app.ts
|
```

## Start

```terminaloutput
npm i
```

## OpenRouteService API

If you want real duration and distance calculations, you need to add a OpenRouteService APi-Key in ``environment.development``
```typescript
export const environment = {
  production: false,
  orsApiKey: 'YOUR-API-KEY-HERE',
};

```

## Authors
Leopold Kainz & Luka Mikulovic

## Link
https://github.com/Tour-Planner-swen2/TourPlannerApp
