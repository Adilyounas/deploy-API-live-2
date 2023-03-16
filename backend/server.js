const app = require("./app");
const dotenv = require("dotenv");
const connectTodataBase = require("./database");
dotenv.config({ path: "backend/config/config.env" });
const cloudinary = require("cloudinary")
//uncaught Error
process.on("uncaughtException", (error) => {
  console.log(`Server is Shutting down due to uncaught error`);
  console.log(`Error: ${error}`);

  process.exit(1);
});

connectTodataBase();

//cloudinary attachment
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, (data) => {
  console.log(`Server is running on ${process.env.PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`Server is Shutting down due to unhandled promise rejection`);
  console.log(`Error: ${error}`);

  server.close(() => {
    process.exit(1);
  });
});
