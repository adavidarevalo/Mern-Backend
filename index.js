const express = require("express")
const connectDataBase = require("./config/db")
const cors = require("cors")

const app = express();

connectDataBase()

app.use(express.json({ extended: true }))
app.use(cors())

const PORT = process.env.Port || 4000;

app.use("/api/user", require("./routes/user"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/projects", require("./routes/projects"))
app.use("/api/tasks", require("./routes/tasks"))

app.listen(PORT, ()=>{
    console.log(`El servidor esta Corriendo en el puerto ${PORT}`)
})