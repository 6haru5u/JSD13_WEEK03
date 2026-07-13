import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware helper
const requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required. Please login.' });
  }
  const user = db.users.findOne({ id: userId });
  if (!user) {
    return res.status(404).json({ message: 'User session not found.' });
  }
  req.user = user;
  next();
};

// Root route to check API status
app.get('/', (req, res) => {
  res.json({
    status: "online",
    message: "Concert Ticketing API Server is fully functional. Open http://localhost:5173 for the frontend app.",
    endpoints: {
      concerts: "/api/concerts",
      register: "/api/auth/register",
      login: "/api/auth/login"
    }
  });
});

// --- REST API ENDPOINTS ---

// 1. Concerts Catalog
app.get('/api/concerts', (req, res) => {
  try {
    const concerts = db.concerts.find();
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve concert catalog.' });
  }
});

app.get('/api/concerts/:id', (req, res) => {
  try {
    const concert = db.concerts.findById(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found.' });
    }
    res.json(concert);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve concert details.' });
  }
});

// 2. Seating Map availability for a Concert
app.get('/api/concerts/:id/seats', (req, res) => {
  try {
    const seats = db.seats.findByConcert(req.params.id);
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve seating arrangement.' });
  }
});

// 3. User Authentication
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !password) {
    return res.status(400).json({ message: 'Please provide all details (firstName, lastName, email, phone, password)' });
  }

  try {
    const existingUser = db.users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = db.users.create({ firstName, lastName, email, phone, password });
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = db.users.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to authenticate user.' });
  }
});

// 4. Ticket Bookings
app.get('/api/bookings', requireAuth, (req, res) => {
  try {
    const bookings = db.bookings.findByUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve booking history.' });
  }
});

app.post('/api/bookings', requireAuth, (req, res) => {
  const { concertId, selectedSeats, paymentMethod } = req.body;
  if (!concertId || !selectedSeats || !selectedSeats.length) {
    return res.status(400).json({ message: 'Concert ID and seat selections are required.' });
  }

  try {
    // Calculate total price
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Verify all selected seats are still available
    const seatsInDb = db.seats.findByConcert(concertId);
    const selectedSeatIds = selectedSeats.map(s => s.id);
    const unavailableSeats = seatsInDb.filter(s => selectedSeatIds.includes(s.id) && s.status !== 'Available');
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some of your selected seats ( ' + unavailableSeats.map(s => s.seat_number).join(', ') + ' ) have already been booked. Please select other seats.'
      });
    }

    // Process transactional booking creation
    const newBooking = db.bookings.create(
      req.user.id,
      concertId,
      selectedSeats,
      totalPrice,
      paymentMethod
    );

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete ticket booking process.' });
  }
});

// 5. Cancel Bookings
app.post('/api/bookings/:id/cancel', requireAuth, (req, res) => {
  try {
    const cancelledBooking = db.bookings.cancel(req.params.id);
    res.json({
      message: 'Booking cancelled successfully. Seats released.',
      booking: cancelledBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to cancel booking.' });
  }
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Concert Ticketing API Server running!`);
  console.log(`🔗 API Base: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
