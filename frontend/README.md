# CertusChain Frontend

Modern web application built with Next.js 14, TypeScript, and Tailwind CSS for CertusChain supply chain traceability platform.

## 🚀 Features

- **Authentication**: Secure login and registration with JWT
- **Factory Management**: Create and manage manufacturing facilities
- **Supplier Management**: Track raw material suppliers with certifications
- **Supply Chain Traceability**: QR code lookup for complete product lineage
- **IoT Device Management**: Register and monitor sensor devices
- **ESG Reports**: AI-powered sustainability report generation
- **User Management**: Role-based access control (Admin, Factory Manager, Viewer)
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **API Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Edit .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── factories/      # Factory management
│   │   │   ├── suppliers/      # Supplier management
│   │   │   ├── traceability/   # Supply chain tracking
│   │   │   ├── devices/        # IoT device management
│   │   │   ├── reports/        # ESG reports
│   │   │   ├── users/          # User management (Admin)
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   └── page.tsx        # Dashboard home
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── tabs.tsx
│   ├── lib/
│   │   ├── api.ts              # API client and endpoints
│   │   └── utils.ts            # Utility functions
│   └── store/
│       └── auth.ts             # Authentication state
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔐 Authentication Flow

1. **Register**: Create company account with admin user
2. **Login**: Authenticate with email and password
3. **JWT Token**: Stored in localStorage and attached to all API requests
4. **Auto-redirect**: Unauthorized users redirected to login page

## 📱 Key Pages

### Dashboard (`/dashboard`)
- Overview statistics
- Quick action cards
- Getting started guide

### Factories (`/dashboard/factories`)
- Add, edit, delete factories
- View factory details and locations
- Contact information management

### Suppliers (`/dashboard/suppliers`)
- Manage raw material suppliers
- Track certifications (GOTS, OEKO-TEX, etc.)
- Supplier contact details

### Traceability (`/dashboard/traceability`)
- QR code lookup for products
- Complete supply chain visibility
- Raw material to finished goods tracking

### IoT Devices (`/dashboard/devices`)
- Register energy, water, and waste sensors
- Link devices to factories
- View device status

### ESG Reports (`/dashboard/reports`)
- Generate AI-powered compliance reports
- View historical reports
- Download reports in Markdown format
- Key sustainability metrics

### Users (`/dashboard/users`)
- Admin-only user management
- Create users with different roles
- Role-based access control

## 🎨 UI Components

Built with shadcn/ui components:
- `Button`: Primary actions with variants
- `Card`: Container for content sections
- `Input`: Form input fields
- `Tabs`: Tabbed navigation
- All components are customizable via Tailwind

## 🌐 API Integration

The frontend communicates with the NestJS backend API:

```typescript
// Example API call
import { factoriesAPI } from '@/lib/api';

const factories = await factoriesAPI.getAll();
const factory = await factoriesAPI.create(data);
```

Available API modules:
- `authAPI`: Authentication endpoints
- `factoriesAPI`: Factory CRUD operations
- `suppliersAPI`: Supplier management
- `devicesAPI`: IoT device registration
- `traceabilityAPI`: Supply chain tracking
- `reportsAPI`: ESG report generation
- `usersAPI`: User management

## 🔑 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎯 User Roles

- **ADMIN**: Full access to all features
- **FACTORY_MANAGER**: Manage factories, suppliers, production
- **VIEWER**: Read-only access

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```bash
docker build -t certuschain-frontend .
docker run -p 3001:3000 certuschain-frontend
```

### Environment Variables for Production

Set `NEXT_PUBLIC_API_URL` to your production API URL.

## 📝 Development Notes

- Uses Next.js 14 App Router (not Pages Router)
- All dashboard pages use 'use client' directive
- State management with Zustand for auth
- Automatic JWT token refresh on 401 errors
- Responsive design with mobile-first approach

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 📄 License

Part of the CertusChain platform.

---

**Built with ❤️ for sustainable supply chains**
