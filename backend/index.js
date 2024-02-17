import dotenv from "dotenv";
import { app } from "./app.js"; 
import { connectDB } from "./db/db.js";

dotenv.config();
const port = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log("listening on port", port)
    });
    app.on('error', (err) => console.log("Connected to database, but server not listening", err.message))
})
.catch((error) => {
    console.log("Error connecting to DB: " + error.message)
    process.exit(1);
})