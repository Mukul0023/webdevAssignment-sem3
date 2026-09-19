const express = require("express");

const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();



app.use(express.json());



app.use(logger);


app.use("/students", studentRoutes);



app.get("/", (req, res) => {
    res.status(200).json({
        message: "Student Management REST API is running"
    });
});



app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});     