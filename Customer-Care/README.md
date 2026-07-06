# Customer Care MERN App

Customer Care is a MERN-style customer profile registry with a React client and an Express/MongoDB server.

## Folder Structure

```text
Customer-Care/
  Client/
    src/
      components/
      pages/
      services/
  Server/
    controllers/
    models/
    routes/
```

## Run The App

Install and run the server:

```bash
cd Server
npm install
copy .env.example .env
npm run dev
```

Install and run the client in another terminal:

```bash
cd Client
npm install
copy .env.example .env
npm run dev
```

Open the client at `http://localhost:5173`.

## API Endpoints

```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

The server expects MongoDB at `mongodb://127.0.0.1:27017/customer-care` unless `MONGO_URI` is changed in `.env`.
