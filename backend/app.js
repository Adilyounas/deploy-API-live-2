const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const productRouter = require("./routes/productRoutes")
const userRouter = require("./routes/userRoutes")
const productReviewRouter = require("./routes/productReviewsRoutes")
const orderRouter = require("./routes/orderRoutes")



app.use(express.json())
app.use(cookieParser())


//product routes
app.use("/api/v1",productRouter)


//user routes
app.use("/api/v1",userRouter)

//product Reviews Router
app.use("/api/v1",productReviewRouter)


//product Reviews Router
app.use("/api/v1",orderRouter)

module.exports = app