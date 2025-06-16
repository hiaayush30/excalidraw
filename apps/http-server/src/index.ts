import express from "express";
import userRouter from "./routes/user.route";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow common HTTP methods
    credentials: true, // Allow cookies and authentication headers to be sent cross-origin
    exposedHeaders: ["authorization"], // Tell the browser to expose the 'Authorization' header
}));

app.get("/api/check", (req, res) => {
    res.json({
        message: "http server running"
    })
})
app.use("/api/user", userRouter);

app.listen(8000, () => {
    console.log("http-server running on port " + 8000);
}) 