# GreenLoop

GreenLoop is a full-stack circular marketplace for Nepal. It helps people give used items another life by listing them to sell, swap, donate, or repair, and lets the community explore items and track estimated environmental impact.

> Listings, members, and stories are demo data. Impact figures are estimates, not measured environmental outcomes.

## Features

### Available in the web app

- Register, sign in, and sign out with JWT-based authentication.
- Browse listings and search, filter, sort, and paginate results; Explore state is synced with the URL.
- View item photos, details, condition, circularity score, and score breakdown.
- Create listings through a multi-step flow with up to five photos, category and condition details, and a live score preview.
- Edit and delete your own listings; pause, resume, reserve, complete, undo completion, and reopen listings.
- Save items and manage saved listings from the dashboard.
- Propose swaps using one of your listings, review incoming and outgoing requests, and accept or decline requests.
- Browse categories loaded from the database.
- View personal impact summaries, monthly and action charts, levels, badges, and an explanation of impact assumptions.
- Visit Home, About, Contact, and Impact pages.
- Use responsive layouts, including mobile-friendly navigation and Explore filters.

### Not currently implemented in the web app

These are not included as working features in the current application:

- Cash purchases, checkout, or payment processing. “Sell” is a listing type; the app does not process payments.
- Integrated donation organizations or donation fulfillment workflows.
- Repair provider booking or repair request management.
- User-to-user chat, messaging, or real-time notifications.
- A separate user profile management experience.
- Admin dashboard, moderation tools, or report management.
- Reviews and ratings.
- Delivery or shipping integration.
- Socket.IO, Cloudinary, or Docker integration.
- AI listing assistance or personalized recommendations.

## Technology Stack

### Frontend

- React 18 and JavaScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Recharts, Lucide, and react-hot-toast

### Backend

- Node.js and Express
- REST API
- MongoDB and Mongoose
- JWT authentication and bcryptjs password hashing
- Multer for local image uploads
- express-validator, Helmet, CORS, Morgan, and express-rate-limit

## Project Structure

```text
greenloop/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── pages/
├── backend/
│   ├── uploads/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed/
│       ├── services/
│       └── utils/
├── .env.example
├── package.json
└── README.md
```

## System Architecture

The application uses a client-server architecture. The React client makes HTTP requests to the Express REST API. The API validates requests, applies authentication and business rules, and reads or writes data through Mongoose and MongoDB. Listing photos are uploaded to local server storage.

```text
React client ── HTTP / JSON ──> Express REST API ── Mongoose ──> MongoDB
                                      │
                                      └── Local listing photo uploads
```

## Data and Current Scope

MongoDB stores users, items, categories, favorites, swap requests, contact messages, impact records, and testimonials. The app seeds demo users, categories, listings, testimonials, and impact history when the database is empty.

The current app supports item listings and swap requests. It does not have payment transactions, donation or repair workflows, messages, notifications, reviews, or moderation collections/features.

The app is configured for Kathmandu, Lalitpur, Bhaktapur, and Pokhara, and displays prices in NPR.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### Install dependencies

From the project root:

```bash
npm run install:all
```

### Environment variables

The backend reads its environment file from `backend/.env`. Copy `backend/.env.example` to `backend/.env` and set values as needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/greenloop
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Keep secrets in `.env`; do not commit that file. The server has development defaults for `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`, but configure a private `JWT_SECRET` before deployment.

### Run the application

From the project root, start both the API and frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (typically <http://localhost:5173>). The API defaults to <http://localhost:5000>.

You can also run the applications separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

### Seed the database

The server seeds data automatically when the database has no items. To run the seed script manually:

```bash
npm run seed
```

### Production build

Build the frontend from the project root:

```bash
npm run build
```

## Demo Accounts

When using the seeded database:

| Account | Email | Password |
| --- | --- | --- |
| Member | `aarati@demo.np` | `demo1234` |
| Admin demo account | `admin@demo.np` | `demo1234` |

The admin demo account is seeded, but a separate admin dashboard or moderation interface is not currently implemented.

## Security

- Passwords are hashed with bcryptjs.
- JWTs are used for authentication.
- Protected routes and ownership checks restrict access to user-specific actions.
- Request validation and centralized error handling are applied on the server.
- Helmet, CORS configuration, and rate limiting are included.
- Environment files and secrets should remain local and must not be committed.

## Future Improvements

Possible future work includes:

- Payment processing for listings
- Donation and repair workflows
- Messaging and notifications
- Admin moderation tools
- Delivery integration
- Personalized recommendations
- More detailed sustainability analytics
- A mobile application

## Author

**Dikshya Sitaula**  
BSc (Hons) Computer Science with Artificial Intelligence  
Sunway College Kathmandu  
Affiliated with Birmingham City University

## License

This project was developed for academic purposes. No separate open-source license is currently specified.
