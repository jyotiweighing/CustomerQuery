const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();
const connectDB=require("./config/db");
const userRoutes = require("./routes/user.routes");
const app=express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",require("./routes/auth.routes"));
app.use("/api/user", userRoutes);
app.use('/api/depart', require('./routes/departmentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/install', require('./routes/installationRoutes'));
app.use('/api/task', require('./routes/task.routes'));
app.use('/api/notification', require('./routes/notificationRoutes'));
app.use('/api/report', require('./routes/reportRoutes'))

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{

console.log(`Server Running ${PORT}`);

});



