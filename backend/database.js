const mongoose =require("mongoose")
mongoose.set('strictQuery', true);
const connectTodataBase =()=>{
    mongoose.connect(process.env.MONGODB_URI).then((data)=>{
        console.log(`Connected to database on ${data.connection.host}`)
    
    })
}

module.exports = connectTodataBase