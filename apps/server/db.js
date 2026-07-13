import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'db.json');

function initDb() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Check if file exists, or if it needs to be overwritten/initialized with the new concert scheme
  let needsSeed = false;
  if (!fs.existsSync(dbPath)) {
    needsSeed = true;
  } else {
    try {
      const existing = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (!existing.concerts || existing.concerts.length < 5 || !existing.artists) {
        needsSeed = true;
      }
    } catch (e) {
      needsSeed = true;
    }
  }

  if (needsSeed) {
    console.log("Seeding Concert Ticket Booking Database...");
    const seedData = {
      users: [],
      artists: [
        {
          id: "art-1",
          name: "Valkyrie Horizon",
          genre: "Synthwave / Cyberpunk",
          country: "Sweden",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "art-2",
          name: "Neo Tokyo Symphony",
          genre: "Orchestral Crossover",
          country: "Japan",
          image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "art-3",
          name: "Cybernetic Oasis",
          genre: "Alternative Rock",
          country: "United Kingdom",
          image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60"
        }
      ],
      venues: [
        {
          id: "ven-1",
          venue_name: "Quantum Dome Arena",
          address: "99 Cyber Avenue, Neo Bangkok",
          capacity: 1500
        },
        {
          id: "ven-2",
          venue_name: "Aether Amphitheatre",
          address: "Level 88, Sky Towers, Cloud City",
          capacity: 1000
        }
      ],
      concerts: [
        {
          id: "con-1",
          artist_id: "art-1",
          venue_id: "ven-1",
          title: "Valkyrie Horizon: Midnight Pulse Tour",
          concert_date: "2026-08-15",
          start_time: "20:00",
          end_time: "23:00",
          image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "con-2",
          artist_id: "art-2",
          venue_id: "ven-2",
          title: "Neo Tokyo Symphony: Cybernetic Odyssey",
          concert_date: "2026-08-28",
          start_time: "19:00",
          end_time: "22:00",
          image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "con-3",
          artist_id: "art-3",
          venue_id: "ven-1",
          title: "Cybernetic Oasis: Echoes of Rebirth",
          concert_date: "2026-09-12",
          start_time: "20:30",
          end_time: "23:30",
          image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "con-4",
          artist_id: "art-1",
          venue_id: "ven-2",
          title: "Valkyrie Horizon: Acoustic Starlight Session",
          concert_date: "2026-09-25",
          start_time: "18:00",
          end_time: "20:30",
          image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "con-5",
          artist_id: "art-2",
          venue_id: "ven-1",
          title: "Neo Tokyo Symphony: Anime Classics Redefined",
          concert_date: "2026-10-10",
          start_time: "19:30",
          end_time: "22:30",
          image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "con-6",
          artist_id: "art-3",
          venue_id: "ven-2",
          title: "Cybernetic Oasis: Unplugged in the Clouds",
          concert_date: "2026-10-24",
          start_time: "20:00",
          end_time: "22:30",
          image: "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=800&auto=format&fit=crop&q=60"
        }
      ],
      seats: [], // Filled dynamically per concert
      bookings: [],
      payments: []
    };

    // Generate seats for each concert
    // 3 zones: VIP (A1-A6, price 3000), Zone A (B1-B6, price 1800), Zone B (C1-C6, price 900)
    seedData.concerts.forEach(concert => {
      const seatLayout = [
        { zone: 'VIP', price: 3000, rows: ['A'] },
        { zone: 'Zone A', price: 1800, rows: ['B', 'C'] },
        { zone: 'Zone B', price: 900, rows: ['D', 'E'] }
      ];

      let seatIndex = 1;
      seatLayout.forEach(z => {
        z.rows.forEach(rowLetter => {
          for (let num = 1; num <= 6; num++) {
            seedData.seats.push({
              id: `seat-${concert.id}-${rowLetter}${num}`,
              concert_id: concert.id,
              venue_id: concert.venue_id,
              zone: z.zone,
              seat_number: `${rowLetter}${num}`,
              price: z.price,
              status: "Available"
            });
          }
        });
      });
    });

    fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2));
  }
}

initDb();

export function readData() {
  initDb();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

export function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Database models
export const db = {
  artists: {
    find: () => readData().artists,
    findById: (id) => readData().artists.find(a => a.id === id)
  },
  venues: {
    find: () => readData().venues,
    findById: (id) => readData().venues.find(v => v.id === id)
  },
  concerts: {
    find: () => {
      const data = readData();
      return data.concerts.map(c => {
        const artist = data.artists.find(a => a.id === c.artist_id);
        const venue = data.venues.find(v => v.id === c.venue_id);
        return { ...c, artist, venue };
      });
    },
    findById: (id) => {
      const data = readData();
      const c = data.concerts.find(item => item.id === id);
      if (!c) return null;
      const artist = data.artists.find(a => a.id === c.artist_id);
      const venue = data.venues.find(v => v.id === c.venue_id);
      return { ...c, artist, venue };
    }
  },
  seats: {
    findByConcert: (concertId) => {
      return readData().seats.filter(s => s.concert_id === concertId);
    },
    updateStatus: (seatIds, newStatus) => {
      const data = readData();
      data.seats = data.seats.map(s => {
        if (seatIds.includes(s.id)) {
          return { ...s, status: newStatus };
        }
        return s;
      });
      writeData(data);
    }
  },
  users: {
    findOne: (query) => {
      const users = readData().users;
      return users.find(u => {
        return Object.keys(query).every(key => u[key] === query[key]);
      });
    },
    create: (userData) => {
      const data = readData();
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString()
      };
      data.users.push(newUser);
      writeData(data);
      return newUser;
    }
  },
  bookings: {
    findByUser: (userId) => {
      const data = readData();
      const userBookings = data.bookings.filter(b => b.user_id === userId);
      // Populate concert details
      return userBookings.map(b => {
        const concert = data.concerts.find(c => c.id === b.concert_id);
        const artist = data.artists.find(a => a.id === (concert?.artist_id));
        const venue = data.venues.find(v => v.id === (concert?.venue_id));
        const payment = data.payments.find(p => p.booking_id === b.id);
        return {
          ...b,
          concert: concert ? { ...concert, artist, venue } : null,
          payment
        };
      });
    },
    create: (userId, concertId, selectedSeats, totalPrice, paymentMethod) => {
      const data = readData();
      const bookingId = `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create embedded tickets with mock QR Codes
      const tickets = selectedSeats.map(seat => ({
        seat_id: seat.id,
        seat_no: seat.seat_number,
        zone: seat.zone,
        price: seat.price,
        qr_code: `AURA-TICKET-${bookingId}-${seat.seat_number}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      }));

      const newBooking = {
        id: bookingId,
        user_id: userId,
        concert_id: concertId,
        booking_date: new Date().toISOString(),
        total_price: totalPrice,
        status: "Paid",
        tickets
      };

      // Update seat statuses to Booked in db
      data.seats = data.seats.map(s => {
        const match = selectedSeats.some(sel => sel.id === s.id);
        if (match) {
          return { ...s, status: "Booked" };
        }
        return s;
      });

      // Create matching Payment record
      const newPayment = {
        id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        booking_id: bookingId,
        amount: totalPrice,
        payment_method: paymentMethod || "CyberWallet",
        payment_date: new Date().toISOString(),
        transaction_id: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: "Paid"
      };

      data.bookings.push(newBooking);
      data.payments.push(newPayment);

      writeData(data);
      
      // Return populated representation
      const concert = data.concerts.find(c => c.id === concertId);
      const artist = data.artists.find(a => a.id === concert.artist_id);
      const venue = data.venues.find(v => v.id === concert.venue_id);
      return {
        ...newBooking,
        concert: { ...concert, artist, venue },
        payment: newPayment
      };
    },
    cancel: (bookingId) => {
      const data = readData();
      const booking = data.bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error("Booking record not found");
      if (booking.status === "Cancelled") return booking;

      // Update booking status
      data.bookings = data.bookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: "Cancelled" };
        }
        return b;
      });

      // Release seats
      const seatIdsToRelease = booking.tickets.map(t => t.seat_id);
      data.seats = data.seats.map(s => {
        if (seatIdsToRelease.includes(s.id)) {
          return { ...s, status: "Available" };
        }
        return s;
      });

      // Update matching payment status
      data.payments = data.payments.map(p => {
        if (p.booking_id === bookingId) {
          return { ...p, status: "Refunded" };
        }
        return p;
      });

      writeData(data);
      return { ...booking, status: "Cancelled" };
    }
  }
};
