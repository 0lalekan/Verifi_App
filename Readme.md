# Verifi - Product Verification and Tracking System

Verifi is a comprehensive product verification and tracking platform designed to combat counterfeit products in the market. The system enables consumers to verify product authenticity through QR code scanning, manufacturers to manage their product inventory, and regulators to monitor and enforce compliance.

## Features

### 🛡️ **Consumer Features**
- **Product Verification**: Scan QR codes to verify product authenticity, expiration, and status
- **Real-time Alerts**: Instant notifications about product validity (Valid, Expired, Fake)
- **Reporting System**: Report suspicious or counterfeit products
- **Rewards Program**: Earn points for successful verifications
- **Consumer Dashboard**: View verification history and personal reports

### 🏭 **Manufacturer Features**
- **Account Verification**: Secure manufacturer account verification system
- **Product Registration**: Register individual product batches with detailed information
- **Bulk Upload**: Upload multiple products via CSV files
- **Inventory Management**: Comprehensive inventory tracking and management
- **Analytics Dashboard**: View verification statistics and product performance

### 🏛️ **Regulator Features**
- **Real-time Monitoring**: Live alerts for counterfeit detection
- **Manufacturer Verification**: Approve manufacturer accounts and organizations
- **Verification Queue**: Manage pending manufacturer verifications
- **Admin Analytics**: Comprehensive reporting and analytics dashboard
- **Compliance Tracking**: Monitor product authenticity across the system

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Toast** - Notification system
- **Chart.js** - Data visualization
- **React Leaflet** - Interactive maps
- **Socket.io Client** - Real-time communication
- **QR Code Scanner** - Product verification interface

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CSV Parser** - Bulk data processing

### Development Tools
- **ESLint** - Code linting
- **Vite Plugin PWA** - Progressive Web App support
- **Nodemon** - Development server auto-restart

## Project Structure

```
ogamed/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # Page components and routes
│   │   ├── hooks/          # Custom React hooks
│   │   └── store.js        # State management (Zustand)
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Business logic handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
└── README.md
```

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

## Installation & Setup

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/0lalekan/Verifi_App.git
   cd Verifi_App
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env` in the server directory
   - Update the following variables:
     ```env
     MONGO_URI=mongodb://localhost:27017/ogamed
     PORT=5000
     JWT_SECRET=your-jwt-secret-key
     ```

### Backend Setup

1. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Start the backend server**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Usage

### User Roles and Permissions

1. **Consumer Registration**
   - Register with basic information
   - Start scanning products immediately

2. **Manufacturer Registration**
   - Register with organization details
   - Submit documentation for verification
   - Wait for regulator approval

3. **Regulator Access**
   - Requires special access permissions
   - Monitor system-wide activity

### Core Workflows

1. **Product Verification Flow**
   - Consumer scans QR code
   - System validates batch number
   - Returns status (Valid/Expired/Fake)
   - Awards points for legitimate scans

2. **Manufacturer Onboarding**
   - Register account with organization details
   - Submit for verification
   - Once approved, access manufacturer features

3. **Regulator Oversight**
   - Review pending manufacturer verifications
   - Receive real-time alerts for fake detections
   - Access comprehensive analytics

## API Documentation

### Main Endpoints

#### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile

#### Product Management
- `POST /api/products/verify` - Verify product batch
- `POST /api/products` - Create product batch
- `POST /api/products/bulk-upload` - Bulk upload batches
- `GET /api/products/my-inventory` - Get manufacturer inventory

#### Reporting
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/consumer` - Consumer reports
- `GET /api/reports/manufacturer` - Manufacturer reports
- `GET /api/reports/admin` - Admin reports

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please contact the development team or create an issue in the repository.
