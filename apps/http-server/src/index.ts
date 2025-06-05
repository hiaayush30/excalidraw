import express from "express";
import userRouter from "./routes/user.route";

const app = express();
app.use(express.json());

app.get("/api/check",(req,res)=>{
    res.json({
        message:"http server running"
    })
})
app.use("/api/user",userRouter);

app.listen(8000,()=>{
    console.log("http-server running on port "+8000);
}) 