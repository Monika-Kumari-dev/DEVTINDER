const express =  require('express');
const app = express();

// app.delete("/user",(req,res) =>{
//     res.send("Deleted successfully!");
// });
app.get("/test",(req,res) =>{
    res.send("Hello my loveeeee");
});

// app.post("/user",(req,res) =>{
//     //saving data to DB
//     res.send("Data successfully saved to the database!");
// })
app.get(/^\/a(bc)?d$/,(req,res) =>{
    res.send({firstName: "Monika",lastName:"Singh"});
});
// app.get("/user",(req,res)=>{
//     console.log(req.query);
//     res.send({firstName:"Monika",lastName:"S"});
// });
// app.get("/user/:userId",(req,res)=>{
//     console.log(req.params);
//     res.send({firstName:"Monika",lastName:"S"});
// });
app.use(
    "/user",(req,res,next) =>{
        console.log("Handling the route user!!");
        next();
        res.send("Response!!");
    },
    (req,res) =>{
        console.log("Handling the route user 2!!");
        res.send("2nd Response!!");
    }
);

app.listen(3000,() =>{
    console.log("Server is successfully listening on port 3000...");
} );