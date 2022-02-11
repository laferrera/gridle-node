// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const monomeGrid = require('monome-grid');
const res = require("express/lib/response");
let grid;
// let grid = monomeGrid();

let led = [];
for (let y = 0; y < 8; y++) {
    led[y] = [];
    for (let x = 0; x < 16; x++) {
        led[y][x] = 0;
    }
}
const blankLed = { ...led };

function clearLeds() {
    for (let y = 0; y < 8; y++) {
        led[y] = [];
        for (let x = 0; x < 16; x++) {
            led[y][x] = 0;
        }
    }
}

/**
 * App Variables
 */

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.post("/api/grid/set_individual", (req, res) => {
    
    var x = Number(req.body.x);
    x = Math.min(x, 7);
    var y = Number(req.body.y);
    y = Math.min(y, 15);
    var b = Number(req.body.b);
    b = Math.min(b, 15);
    // led[x][y] = Math.floor(Math.random() * 16);
    led[x][y] = b;
    console.log(`setting x: ${x}, y: ${y} val: ${b}`);
    grid.refresh(led);
    res.send(`setting x: ${x}, y: ${y} val: ${b}`);
});

app.post("/api/grid/set_grid", (req, res) => {

    let incomingGrid = req.body.grid;
    let myGrid  = { ...led };
    incomingGrid.forEach(function(row, y) {
        for (var i = 0; i < row.length; i++) {
            myGrid[y][i] = Number(incomingGrid[y][i]) * 15;
        }
    });
    console.log(myGrid)
    console.log(`setting grid: ${myGrid}`);
    grid.refresh(myGrid);
    res.send("set the grid");
});


app.post("/api/grid/clear", (req, res) => {

    clearLeds();
    grid.refresh(led);
    res.send("cleared");
});

app.get("/example", (req,res) => {
    // grid.key((x, y, s) => console.log(`x: ${x}, y: ${y}, s: ${s}`));
        res.render("example", { title: "example"});    
});

// app.get("/example", (req, res) => {
//     let grid = monomeGrid();
//     grid.then(function (grid) {
//         res.render("example", { title: "example" ,
//                                 grid: grid
//                                 // grid: grid
//         });
//     });
// });

app.get("/ind", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

/**
 * Server Activation
 */

async function run() {
    grid = await monomeGrid();

    grid.key((x, y, s) => console.log(`x: ${x}, y: ${y}, s: ${s}`));

    // setInterval(() => {
        // let led = [];
        // for (let y = 0; y < 8; y++) {
        //     led[y] = [];
        //     for (let x = 0; x < 16; x++) {
        //         led[y][x] = Math.floor(Math.random() * 16);
        //     }
        // }
    //     grid.refresh(led);
    // }, 100);
}

run();
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});