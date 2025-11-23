# DATC AgroShop

A comprehensive ERP system for Deepak Agriculture and Trading Company, built with React (TypeScript) frontend and Node.js/Express backend.

## Features

- 📊 **Dashboard** - Overview of business metrics and statistics
- 🌾 **Product Management** - Manage products with images, pricing, GST, and inventory
- 📦 **Inventory Management** - Track stock levels and transactions
- 🧾 **Sales & Billing** - Create invoices with GST calculation and PDF export
- 👥 **Customer Management** - Maintain customer database and outstanding balances
- 💰 **Payment Tracking** - Record customer and supplier payments
- 🚚 **Supplier Management** - Manage supplier information and account balances
- 📈 **Reports** - Generate sales reports and analytics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- Axios
- jsPDF & html2canvas (for PDF generation)
- Recharts (for data visualization)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kubersingh123/DATC-AgroShop.git
cd DATC-AgroShop
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/datc-agroshop
JWT_SECRET=your-secret-key-here
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Login Credentials

- Email: `admin@agroshop.com`
- Password: `Agro@123`

## Project Structure

```
DATC-AGRO-SHOP/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth and error handling
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Helper functions
│   └── package.json
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Helper functions
│   └── package.json
└── README.md
```

## Features in Detail

### Invoice/Bill Generation
- Professional bill format with company details
- GST calculation and breakdown
- PDF export functionality
- Direct print support

### Product Cards
- Image support for products
- Stock status indicators
- Responsive card layout

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Adaptive navigation (sidebar on desktop, navbar on mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary software for Deepak Agriculture and Trading Company.

## Author

**Kuber Singh**
- GitHub: [@Kubersingh123](https://github.com/Kubersingh123)
- Location: Rampur Baghelan, Satna, M.P.

## Support

For support, email DATC@AgroShop.com

