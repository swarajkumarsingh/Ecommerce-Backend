const app = require("./app.js");

// // Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err}`);
//   console.log("Shuting down the server due to Uncaught Exception");
//   process.exit(1);
// });
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Error : ${err}`);
//   console.log(`Shuting down the server due to Unhandled Promise Rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });

// // Unhandled Promise Rejection Monitor
// process.on("uncaughtExceptionMonitor", (err) => {
//   console.log(`Error : ${err}`);
//   console.log(`Shuting down the server due to Unhandled Promise Rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });
