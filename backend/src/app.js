import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import Routes from "./routes/Routes.js";

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors());

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/", Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
