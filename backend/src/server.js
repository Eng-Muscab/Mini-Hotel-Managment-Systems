import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import roomserverce from "./modules/room/root.routes.js";
import { customerController } from "./modules/customer/cus.controller.js";
import { bookingController } from "./modules/booking/booking.controller.js";
import { roomBedsController } from "./modules/room_beds/rm.controller.js";
import { bedController } from "./modules/beds/bed.controller.js";
import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomserverce);
app.use("/api/customers", customerController);
app.use("/api/bookings", bookingController);
app.use("/api/roomBeds", roomBedsController);
app.use("/api/beds", bedController);
app.use("/api/auth", authRoute);

app.use("/api", (req, res) => res.status(404).json({ message: "Not Found" }));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
