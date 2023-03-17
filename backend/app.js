const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const productRouter = require("./routes/productRoutes")
const userRouter = require("./routes/userRoutes")
const productReviewRouter = require("./routes/productReviewsRoutes")
const orderRouter = require("./routes/orderRoutes")
const cors = require("cors")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({extended:false}))
app.use(fileUpload())

//product routes
app.use("/api/v1",productRouter)


//user routes
app.use("/api/v1",userRouter)

//product Reviews Router
app.use("/api/v1",productReviewRouter)


//product Reviews Router
app.use("/api/v1",orderRouter)

module.exports = app