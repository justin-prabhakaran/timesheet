import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import projectRouter from "./routers/project_router";
import taskRouter from "./routers/task_router";
import timeLogRouter from "./routers/time_log_router";
import userRouter from "./routers/user_router";

const app = express();
const PORT = 3003;
const MONGO_URI = "mongodb+srv://justin:justin98430@timesheetclutster.6haii.mongodb.net/?retryWrites=true&w=majority&appName=timesheetClutster";

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors())


// Routers
app.use("/api/project", projectRouter);
app.use("/api/task", taskRouter);
app.use("/api/timelog", timeLogRouter);
app.use("/api/user", userRouter);

// MongoDB Connection
(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // Start the server after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure code
    }
})();
