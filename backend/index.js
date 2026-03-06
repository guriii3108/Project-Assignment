import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/v1/authRoutes.js"
import connectDB from "./src/config/database.js"
import errorHandler from "./src/middlewares/errorHandler.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
