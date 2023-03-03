const app = require("./app");
const dotenv = require("dotenv");
const connectTodataBase = require("./database");
dotenv.config({ path: "backend/config/config.env" });

//uncaught Error
process.on("uncaughtException", (error) => {
  console.log(`Server is Shutting down due to uncaught error`);
  console.log(`Error: ${error}`);

  process.exit(1);
});

connectTodataBase();
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
