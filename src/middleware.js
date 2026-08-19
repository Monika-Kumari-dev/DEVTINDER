const express = require('express');

const app = express();

app.get("/admin/getAllData", (req, res) => {

    // Logic of checking if the request is authorized

    const token = "xyz";

    const isAdminAuthorized = token === "xyz";

    if (isAdminAuthorized) {
        res.send("All data sent");
    } else {
        res.status(401).send("Unauthorized request");
    }

});

app.listen(7777, () => {
    console.log("Server is successfully listening");
});