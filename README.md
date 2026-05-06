# StudentTray Server

Backend API server for **StudentTray** — a student-focused marketplace platform for buying and selling items, finding accommodation (lodges and rooms), and offering services within school communities.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma (MySQL)
- **Authentication:** JWT + argon2 password hashing
- **Payments:** Paystack
- **Media:** Cloudinary
- **Email:** Nodemailer

## Features

- **User Management** — Sign up, sign in, email verification, password reset, profile editing
- **Marketplace Listings** — Create and manage items for sale with images, pricing, and categories
- **Accommodation** — List and browse lodges and rooms with details like amenities, location, pricing
- **Services** — List and browse services with online/in-person availability
- **Business Profiles** — Business registration and management
- **Reviews** — Rate and review users and businesses
- **Payments** — Subscription plans via Paystack integration
- **Media Upload** — Image and video upload via Cloudinary
- **Webhooks** — Paystack webhook handling for payment events

## Project Structure

```
src/
├── app.ts                          # Express app setup (middleware, routes)
├── server.ts                       # HTTP server entry point
├── controllers/
│   ├── userController.ts           # Auth & user profile logic
│   ├── itemController.ts           # Marketplace item CRUD
│   ├── lodgeController.ts          # Lodge listing CRUD
│   ├── roomController.ts           # Room listing CRUD
│   ├── serviceController.ts        # Service listing CRUD
│   ├── businessController.ts       # Business profile CRUD
│   ├── reviewController.ts         # Review CRUD
│   ├── paystackController.ts       # Paystack payment logic
│   ├── cloudinaryController.ts     # Image upload logic
│   ├── webhookController.ts        # Webhook event handling
│   └── indexController.ts          # Health check & fallback routes
├── routes/
│   ├── userRouter.ts               # /user/* routes
│   ├── itemRouter.ts               # /items/* routes
│   ├── lodgeRouter.ts              # /lodges/* routes
│   ├── roomRouter.ts               # /rooms/* routes
│   ├── serviceRouter.ts            # /services/* routes
│   ├── businessRouter.ts           # /business/* routes
│   ├── cloudinaryRouter.ts         # /cloudinary/* routes
│   ├── webHookRouter.ts            # /webhook/* routes
│   └── indexRouter.ts              # Root routes
├── utils/
│   ├── authorization.ts            # JWT auth middleware
│   ├── giveAuthorization.ts        # Token issuance helper
│   ├── utils.ts                    # Email sending utilities
│   ├── emailVerify.html            # Email verification template
│   └── changePasswordEmail.html    # Password reset email template
prisma/
└── schema.prisma                   # Database schema (MySQL)
```

## Database Schema

The database uses MySQL with the following core models:

| Model | Description |
|---|---|
| `user` | User accounts with auth and subscription data |
| `school` | Supported schools/communities |
| `item` | Marketplace product listings |
| `lodge` | Lodge/accommodation listings |
| `room` | Roommate/shared accommodation listings |
| `service` | Service listings |
| `business` | Business profiles tied to users |
| `review` | User and business reviews |
| `item_school` / `service_school` | Many-to-many school associations |
| `imagesfordelete` | Tracks images pending cleanup |

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL database
- Paystack account (for payments)
- Cloudinary account (for media uploads)

### Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# Run database migrations
npx prisma migrate dev

# Start development server (with hot reload)
npm run dev

# Start production server
npm start
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `TOKEN_SECRET` | JWT signing secret |
| `SITE_URL` | Frontend site URL (for CORS) |
| `SERVER_PORT` | Server port (default: 3000) |
| `PAYSTACK_SECRET_KEY` | Paystack API secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` | SMTP email credentials |
| `ITEMS_FREE_SLOTS` | Free listing slots for items |
| `SERVICES_FREE_SLOTS` | Free listing slots for services |
| `LODGES_FREE_SLOTS` | Free listing slots for lodges |
| `ROOMS_FREE_SLOTS` | Free listing slots for rooms |

## API Routes

### Authentication & Users (`/user/*`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/signUp` | No | Create account |
| POST | `/signIn` | No | Sign in |
| GET | `/signOut` | No | Sign out |
| GET | `/verify/:userId/:token` | No | Verify email |
| GET | `/verify/:userId` | No | Resend verification email |
| POST | `/update-password/:userId/:token` | No | Reset password with token |
| POST | `/update-password` | No | Request password reset email |
| GET | `/profile` | Yes | Get private profile |
| GET | `/public/:userId` | Yes | Get public profile |
| POST | `/editProfile` | Yes | Edit profile |
| POST | `/suggestion` | No | Submit suggestion |
| POST | `/support` | No | Submit support request |

### Items (`/items/*`)

CRUD operations for marketplace product listings.

### Lodges (`/lodges/*`)

CRUD operations for lodge/accommodation listings with amenities.

### Rooms (`/rooms/*`)

CRUD operations for roommate/shared accommodation listings.

### Services (`/services/*`)

CRUD operations for service listings with availability scheduling.

### Business (`/business/*`)

CRUD operations for business profiles with reviews.

### Cloudinary (`/cloudinary/*`)

Image upload and management endpoints.

### Webhooks (`/webhook/*`)

Paystack payment event webhook handler.

## Deployment

The project includes PM2 configuration (`pm2.config.js`) for process management and GitHub Actions workflows for CI/CD:

- `.github/workflows/deploy.yml` — Deployment workflow
- `.github/workflows/node.js.yml` — Node.js CI
- `deploy-node.js.yml` — Deployment configuration

## License

ISC
