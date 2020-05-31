const express = require('express');
const cors = require('cors');
const apple = require('./apple.json');
const ontario = require('./ontario.json');
const app = express();
const methods = require('./methods');



app.get('/alldata', cors(), (req, res) =>{
    res.send(apple);
});


app.get('/correlation/:location/:start', cors(), (req, res) =>{
    const location = req.params.location;
    const start = req.params.start;
    let result = methods.correlationAlg(location, start);
    res.send(result);
});

app.get('/', cors(), (req,res) =>{
    res.send(
        "REST API For Trace The Bug"
    );
});


const port = process.env.PORT || 3001;
app.listen(port, () =>{
    console.log("Rest API live on " + port)
});