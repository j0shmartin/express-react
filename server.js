const mongoose = require("mongoose");
require("dotenv").config();
const { PORT , MONGODB_URI } = process.env;
const express = require("express");
const app = express();
const cors =require("cors");
const morgan = require("morgan")

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on("open", ()=>console.log("connected to mongoose"))
    .on("close",()=>console.log("disconnected from mongoose"))
    .on("error",(error)=>console.log(error));


const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People",PeopleSchema)

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("hello world");
});

app.get("/people",async (req,res)=>{
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post("/people", async (req,res)=>{
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.put("/people/:id", async (req,res)=>{
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id,req.body,{new:true})
        );
    } catch (error) {
        res.status(404).json(error);
    }
});

app.delete("/people/:id", async (req,res)=>{
    try {
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});
    
app.listen(PORT, ()=> console.log(`listening on PORT ${PORT}`));