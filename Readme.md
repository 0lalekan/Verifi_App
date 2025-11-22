# Verifi - Product Verification and Tracking System

Verifi is a comprehensive product verification and tracking platform designed to combat counterfeit products in the global supply chain. By combining cryptographic product serialization with a decentralized verification network, Verifi empowers consumers, manufacturers, and regulators to ensure product authenticity in real-time.

## 🚀 Live Demo

**Live URL:** [https://verifi-five.vercel.app/](https://verifi-five.vercel.app/)

### Test Credentials
Use the following credentials to explore the different user roles and dashboards:

| Role | Email | Password | Capability Focus |
| :--- | :--- | :--- | :--- |
| **Consumer** | `consumertest@verifi.com` | `password123` | Product scanning, reporting, loyalty points |
| **Manufacturer** | `manufacturertest@verifi.com` | `password123` | Batch registration, inventory, analytics |
| **Regulator** | `regulatortest@verifi.com` | `password123` | Oversight, enforcement, entity management |

---

## Features

#### 🛡️ Consumer Features
* **Instant Verification**: Scan QR codes via the PWA interface to instantly verify product authenticity, expiration date, and recall status.
* **Real-time Feedback**: Receive immediate visual feedback (Valid/Fake/Expired) with confetti animations for authentic products.
* **Report Issues**: Flag suspicious products directly to regulators with GPS location tagging and photo evidence.
* **Trust Points**: Earn loyalty rewards for every valid scan, incentivizing community vigilance.
* **Mobile Experience**: Optimized mobile-first design with a native-style bottom navigation bar for easy one-handed use.

### 🏭 Manufacturer Features
* **Secure Onboarding**: Business verification workflow (RC Number/License) required before accessing the network.
* **Batch Management**: Register product batches with metadata (manufacturing date, expiry, SKU) and define scan velocity limits.
* **Bulk Operations**: 
    * Upload large inventories via CSV templates for mass serialization.
    * **Bulk Actions**: Select multiple batches to instantly Activate, Recall, or Delete (unused) items.
* **Anti-Clone Alerts**: Receive automated warnings when specific batch numbers exceed their maximum scan threshold.

### 🏛️ Regulator Features
* **God-Mode Dashboard**: A "control tower" view of national supply chain activity with real-time statistics.
* **Global Registry**: A searchable master database of every product batch in the system across all manufacturers.
* **Advanced Entity Management**: 
    * View a complete list of all registered manufacturers.
    * **Suspend Accounts**: Instantly block login access for non-compliant entities.
    * **Revoke Licenses**: Revoking a manufacturer's license automatically flags all their existing products as "Suspicious" in the database.
* **Audit Log Explorer**: A searchable history of every verification event, filtered by batch number or status (Valid/Fake).
* **Bulk Enforcement**: Select and flag/recall multiple product batches simultaneously from the global registry.
* **Heatmap Visualization**: Interactive maps pinpointing hotspots for counterfeit reports and failed scans.

---

## Tech Stack

### Frontend
* **React 19** - Modern UI with hooks and functional components.
* **Vite** - Next-generation frontend tooling.
* **Tailwind CSS** - Utility-first styling with custom brand configurations.
* **React Query** - Efficient server state management and caching.
* **Zustand** - Lightweight global client state management.
* **Framer Motion** - Smooth UI transitions and animations.
* **React Leaflet** - Interactive maps for geospatial data.
* **ZXing** - Browser-based multi-format barcode/QR scanner.

### Backend
* **Node.js & Express** - Robust RESTful API architecture.
* **MongoDB & Mongoose** - Flexible NoSQL database for storing user profiles, logs, and batch data.
* **Socket.io** - Real-time bidirectional communication for immediate fraud alerts.
* **JWT (JSON Web Tokens)** - Secure, stateless authentication via HTTP-only cookies.
* **Multer & Cloudinary** - Handling file uploads for evidence images.

---

## Project Structure

```bash
verifi/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Header, Footer, Maps, etc.)
│   │   ├── screens/        # Page views (Dashboards, Scanning, Reporting)
│   │   ├── hooks/          # Custom hooks (useUserProfile, useTheme)
│   │   └── store.js        # State management
│   ├── public/             # Static assets (Logos, manifest.json)
│   └── package.json
├── server/                 # Express Backend
│   ├── controllers/        # Business logic (Auth, Products, Logs)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & Validation middleware
│   ├── config/             # DB & Cloudinary config
│   └── server.js           # Entry point
└── README.md
```

## Installation & Setup

To run this project locally:

### 1. Clone the repository

```bash
git clone https://github.com/0lalekan/Verifi_App.git
cd Verifi_App
```

### 2. Backend Setup

Navigate to the server directory, install dependencies, and configure the environment.

```bash
cd server
npm install
```

Create a `.env` file in the server root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_EMAIL=your_email_service
SMTP_PASSWORD=your_email_password
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies.

```bash
cd ../client
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173.

## Usage Guide

### Verification
Access the `/verify-product` route (or "Scan" on mobile) to test the scanner. If on desktop, you can manually enter a Batch Number.

### Simulate a Fake
Try scanning a random QR code or entering a non-existent batch number to see the error handling.

### Simulate Cloning
Manufacturers can set a "Max Scan Limit" for a batch. If that limit is exceeded by consumers, the system flags the batch as "Suspicious."

### Regulator Actions
Log in as a Regulator to access the Entities tab. Try "Suspending" a manufacturer or "Revoking" a license to see how it immediately impacts their access and product status.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements or bug fixes.

## License

This project is licensed under the ISC License.
