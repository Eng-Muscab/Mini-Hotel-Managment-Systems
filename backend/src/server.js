import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import roomserverce from "./modules/room/root.routes.js";
import { customerController } from "./modules/customer/cus.controller.js";
import { bookingController } from "./modules/booking/booking.controller.js";
import { roomBedsController } from "./modules/room_beds/rm.controller.js";
import { bedController } from "./modules/beds/bed.controller.js";
import auth from "./modules/auth/auth.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/rooms", roomserverce);
app.use("/api/customers", customerController);
app.use("/api/bookings", bookingController);
app.use("/api/roomBeds", roomBedsController);
app.use("/api/beds", bedController);
app.use("/api/auth", auth);

app.use("/api", (req, res) => res.status(404).json({ message: "Not Found" }));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  pool.connect().then(() => {
    console.log("✅ Database connected"); 
  });
  pool.query(`SELECT current_database(), current_schema()`)
.then(res => console.log("DB CHECK:", res.rows[0]))
.catch(err => console.error("DB ERROR:", err));
});
