import { Server } from "http";
import mongoose, { connect } from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
let server: Server;
const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to DB!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async()=>{
    await startServer()
})()
process.on("unhandledRejection",(err)=>{
    console.log("Unhandled Rejection detected..... Server shutting down...",err)
    if(server){
        server.close(()=>{
            process.exit(1);
        })
        process.exit(1)
    }
})
process.on("unhandledException",(err)=>{
    console.log("Uncaught Exception detected..... Server shutting down...",err)
    if(server){
        server.close(()=>{
            process.exit(1);
        })
        process.exit(1)
    }
})
process.on("SIGTERM",(err)=>{
    console.log("SIGTERM signal received..... Server shutting down...",err)
    if(server){
        server.close(()=>{
            process.exit(1);
        })
        process.exit(1)
    }
})
process.on("SIGINT",(err)=>{
    console.log("SIGINT signal received..... Server shutting down...",err)
    if(server){
        server.close(()=>{
            process.exit(1);
        })
        process.exit(1)
    }
})
