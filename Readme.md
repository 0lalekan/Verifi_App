Verifi - Supply Chain Verification & Intelligence Platform

Verifi is a decentralized supply chain transparency platform designed to combat counterfeit products. It creates a digital "chain of custody" for products, allowing Manufacturers to serialize inventory, Regulators to oversee the market, and Consumers to verify authenticity instantly using their smartphones.

🚀 Live Demo
URL: https://verifi-five.vercel.app/

🔑 Test Credentials
Use these accounts to explore the different dashboards:

Role | Email | Password | Access Level
-----|--------|----------|-------------
Consumer | consumertest@verifi.com | password123 | Scan products, Earn Points, View Safe Map
Manufacturer | manufacturertest@verifi.com | password123 | Create Batches, Print Labels, Analytics
Regulator | regulatortest@verifi.com | password123 | Audit Logs, Revoke Licenses, Global Search
Distributor | distributortest@verifi.com | password123 | B2B Market, Chain of Custody Scans

✨ Key Features

🛡️ For Consumers
Capture & Verify: A robust camera interface that allows users to snap a photo of a barcode for verification, solving focus issues on diverse devices.
Manual Fallback: Ability to manually type batch numbers if the barcode is damaged or unreadable.
Safe Map: An interactive heatmap showing nearby retailers with a high history of authentic scans.
Trust Points: Gamified rewards system for verifying products.
Report Issues: Direct channel to report suspicious goods with GPS tagging and photo evidence.

🏭 For Manufacturers
Batch Serialization: Generate cryptographically unique identities for production runs.
Bulk Operations: Upload CSV manifests to register thousands of items instantly.
Label Printing: Generate QR code labels directly from the portal.
Anti-Clone Alerts: Automated warnings if a single batch ID exceeds its "Maximum Scan Velocity" (indicating cloning).
B2B Trade Hub: List products for verified distributors to purchase.

🏛️ For Regulators
God-Mode Dashboard: Real-time overview of national verification stats (Valid vs. Fake).
Entity Management: Approve or Revoke manufacturer licenses. Revoking a license automatically flags all their products as "Suspicious".
Audit Trail: Searchable, immutable logs of every verification attempt in the system.
Case Management: Triage and resolve whistleblower reports submitted by consumers.

🚚 For Distributors & Retailers
Chain of Custody: Scan inventory upon receipt to log its movement (Factory → Warehouse → Retailer).
Stock Management: Mark batches as "Shipped" or "Received" to maintain the digital thread.

🛠️ Tech Stack

Frontend
Framework: React 19 (Vite)
Styling: Tailwind CSS (with custom "Glassmorphism" UI)
State Management: Zustand & React Query (TanStack)
Maps: React Leaflet
Scanning: ZXing Library (Browser Multi-Format Reader)
Animations: Framer Motion

Backend
Runtime: Node.js & Express
Database: MongoDB (Mongoose)
Security: JWT Authentication, Helmet, Rate Limiting
Real-time: Socket.io (for Admin Alerts)
Media: Cloudinary (for evidence/profile uploads)
Email: Nodemailer (SMTP)

⚙️ Installation & Setup

Prerequisites
Node.js (v18+)
MongoDB Instance (Local or Atlas)
Cloudinary Account (for image uploads)

1. Clone Repository
```bash
git clone https://github.com/yourusername/verifi-app.git
cd verifi-app
```

2. Backend Setup
Navigate to the server folder and install dependencies:

```bash
cd server
npm install
```

Create a .env file in the server/ directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Start the server:
```bash
npm run dev
```

3. Frontend Setup
Open a new terminal and navigate to the client folder:

```bash
cd client
npm install
```

Start the React development server:
```bash
npm run dev
```

Access the app at http://localhost:5173.

📖 Usage Guide

How to Verify a Product
Open the Scanner: Click "Scan" on the bottom navigation or Dashboard.
Capture: Point your camera at the QR/Barcode. Wait for focus, then tap "Capture Photo".
Verify: Once the image is frozen and clear, tap "Verify Code".
Result: You will receive an instant "Valid", "Fake", or "Expired" status with confetti for authentic items.

How to Simulate a "Fake"
Go to the manual entry screen.
Type a random string (e.g., FAKE-123).
The system will return a "Fake" status because the ID does not exist in the ledger.

How to Simulate a "Clone" Alert
Login as a Manufacturer and create a batch with a Max Scans limit of 1.
Login as a Consumer and scan that batch twice.
The second scan will trigger a "Suspicious" warning (Clone Detected).
The Manufacturer and Regulator will receive a real-time alert.

🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements or bug fixes.

📄 License
This project is licensed under the ISC License.
