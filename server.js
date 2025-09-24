const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// In-memory seat data
let seats = [
  { id: 1, status: "available", lockedBy: null, lockExpires: null },
  { id: 2, status: "available", lockedBy: null, lockExpires: null },
  { id: 3, status: "available", lockedBy: null, lockExpires: null },
  { id: 4, status: "available", lockedBy: null, lockExpires: null },
  { id: 5, status: "available", lockedBy: null, lockExpires: null }
];

const LOCK_DURATION = 60 * 1000; // 1 minute

// Helper to clean expired locks
function cleanExpiredLocks() {
  const now = Date.now();
  seats.forEach(seat => {
    if (seat.status === "locked" && seat.lockExpires <= now) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockExpires = null;
    }
  });
}

// GET: View all seats
app.get("/seats", (req, res) => {
  cleanExpiredLocks();
  res.json(seats);
});

// POST: Lock a seat
app.post("/seats/:id/lock", (req, res) => {
  cleanExpiredLocks();
  const seatId = parseInt(req.params.id);
  const { user } = req.body;

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status === "booked") return res.status(400).json({ error: "Seat already booked" });
  if (seat.status === "locked") return res.status(400).json({ error: `Seat locked by ${seat.lockedBy}` });

  seat.status = "locked";
  seat.lockedBy = user;
  seat.lockExpires = Date.now() + LOCK_DURATION;

  res.json({ message: `Seat ${seat.id} locked for ${user}`, seat });
});

// POST: Confirm a seat booking
app.post("/seats/:id/confirm", (req, res) => {
  cleanExpiredLocks();
  const seatId = parseInt(req.params.id);
  const { user } = req.body;

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status === "available") return res.status(400).json({ error: "Seat is not locked" });
  if (seat.lockedBy !== user) return res.status(400).json({ error: "You do not have a lock on this seat" });

  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockExpires = null;

  res.json({ message: `Seat ${seat.id} successfully booked by ${user}`, seat });
});

// Start server
app.listen(port, () => {
  console.log(`Ticket Booking API running at http://localhost:${port}`);
});

