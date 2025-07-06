import express from "express"
import { connectToDatabase } from "./Database/db.js";
import dotenv from "dotenv"
import excelRoutes from "./routes/excel.js";
// import XlsxPopulate from "xlsx-populate";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({origin: "http://localhost:5174", credentials: true}));
app.use(express.json()); 
app.use(cookieParser());

connectToDatabase();

app.use('/api/auth' , authRoutes)
app.use('/api/excel', excelRoutes);
app.use("/api/admin", adminRoutes);


app.listen(4000, () =>{
    console.log(`Server is Runing on port 4000`)
})

// VhLdRsYjx1nC8N4K
// iKjlJiGH4121Hfa0