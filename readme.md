
# Banking Finance Predication API

This project is a monorepo that consists of some microservices.
- bfp-ms-account - microservice that enables bank integration with open banking api, contains a collection of endpoints used to read transactions from a database, ingest transactions into a database.
- bfp-ms-institutions - microservice serves as a small mapper service which contains all the bank institutions available in the open banking api.


## API Reference

#### Post Create end user agreement

```http
  POST /api/v1/access/createUserAgreement
```

| Parameter            | Type        | Description                                            |
| :------------------- | :---------- | :----------------------------------------------------- |
| `institutionId`      | `string`    | **Required**. Id of the Institution Id to connect with |
| `maxHistoricalDays`  | `number`    | **Required**. Max Historical Days                      |
| `accessValidForDays` | `number`    | **Required**. Access Valid For Days                    |
| `accessScope`        | `array`     | **Required**. Access Scope                             |

 

#### Post Create requisitions

```http
  POST /api/v1/access/requisitions
```

| Parameter       | Type     | Description                                            |
| :-------------- | :------- | :----------------------------------------------------- |
| `institutionId` | `string` | **Required**. Id of the Institution Id to connect with |
| `agreementId`   | `string` | **Required**. Id of the agreement the end user created |

#### Get requisition

```http
  GET /api/v1/access/accounts/:requisitionId
```

| Parameter       | Type     | Description                                 |
| :-------------- | :------- | :------------------------------------------ |
| `requisitionId` | `string` | **Required**. Id of the created requisition |


## Run Locally

Clone the project

```bash
  git clone https://github.com/Bad-boys-dev/banking-finance-prediction-app.git
```

Go to the project directory

```bash
  cd banking-finance-prediction-app
```

Install dependencies

For the accounts microservice
```bash
  npm install --workspace bfp-ms-account
```
For the institutions microservice
```bash
  npm install --workspace bfp-ms-institutions
```

Start the server

For the accounts microservice

```bash
  npm run bfp-ms-account
```
For the institutions microservice (To be added)

```bash
  npm run bfp-ms-institutions
```


## Features

- Light/dark mode toggle
- Custom style toggle


## Tech Stack
**Language** TypeScript, JavaScript

**Client:** React, Redux-Toolkit, Axios, Styled-Component, Storybook

**Server:** Node, Express, PostgreSQL, Drizzle-orm, MongoDB, Zod


## Authors

- [@emmanz1995](https://github.com/emmanz1995)
- [@anojkunes](https://github.com/anojkunes)

