const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require("./src/routes/authRoutes")
const userRoutes = require("./src/routes/userRoutes")
const courseRoutes = require("./src/routes/courseRoutes")
const enrollmentRoutes = require("./src/routes/enrollmentRoutes")

//initialize app
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Routes
app.get("/", (req,res)=>{res.send("welcome to e-learning  go through the documentation for api endpoints ")})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
