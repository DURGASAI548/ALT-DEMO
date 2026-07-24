# ALTLIGHTS storefront

React + Vite frontend for a lighting store. It currently uses catalogue sample data so the complete shopping flow can be reviewed before backend details are connected.

## Run locally

```bash
npm install
npm run dev
```

## Backend integration

The UI is structured around a catalogue, individual product, and cart. When you share the API base URL and endpoint/request-response shapes, replace the temporary `products` catalogue in `src/main.jsx` with calls to your API (or move that data into a dedicated `src/api.js` client). Typical hooks are:

- `GET /products` for the shop catalogue
- `GET /products/:id` for product details
- `POST /cart` or your checkout API for checkout

Set a Vite environment variable such as `VITE_API_BASE_URL` for the API host; never put secrets in the frontend.
