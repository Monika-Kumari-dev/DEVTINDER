const express =  require('express');
const app = express();


app.get("/test",(req,res) =>{
    res.send("Hello my loveeeee");
});
app.use((req,res) =>{
    res.send("Hello Monika from the server");
})

app.listen(3000,() =>{
    console.log("Server is successfully listening on port 3000...");
} );