const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex"); //it's like a factory function, it creates the connection
const process = require("process");

let sqlDb;

function initSqlDB() {
    /* Locally we should launch the app with TEST=true to use SQLlite:

         > TEST = true node ./index.js

      */
    if (process.env.TEST) {
        sqlDb = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./doctorsdb.sqlite"
            }
        });
    } else {
        sqlDb = sqlDbFactory({
            debug: true,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
}



function initDb() { //we first have to specify the schema of the database
    return sqlDb.schema.hasTable("doctors").then(exists => {
        if (!exists) { //if it does not exist we're gonna populate it
            sqlDb.schema
                .createTable("doctors", table => { //this function creates the table
                    table.increments(); //each new row numbers itself automatically, this is a sort of id
                    table.string("name"); //specifiying fields of the table
                    table.integer("date").unsigned();
                    table.enum("sex", ["male", "female"]);
                    table.string("email");
                    table.string("location");
                    table.string("position");
                    table.string("responsible");
                    table.string("service");
                })
                .then(() => { //we populate with the data we had last time
                    return Promise.all( //ritorna la lista di promises
                        _.map(doctorsList, p => {
                            delete p.id;
                            return sqlDb("doctors").insert(p); //every insert returns a promise, we need a wwait to wait for all the promises, we use a std javascript function (promise.all)
                        })
                    );
                });
        } else {
            return true;
        }
    });
}

const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

let doctorsList = require("./doctorstoredata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// /* Register REST entry point */

app.get("/doctors", function (req, res) {

    console.log("sono nella get con start");
    let start = parseInt(_.get(req, "query.start", 0)); //is the last parameter the default value?
    let limit = parseInt(_.get(req, "query.limit", 10)); //il numero era 5
    let sortby = _.get(req, "query.sort", "none");
    let id = parseInt(_.get(req, "query.id", 0));
    let location = _.get(req, "query.location", "none");
    let myQuery = sqlDb("doctors");


    console.log("id=" + id);

    if (sortby === "age") {
        myQuery = myQuery.orderBy("date", "asc");
    } else if (sortby === "-age") {
        myQuery = myQuery.orderBy("date", "desc");
    } else if (sortby === "name") {
        myQuery = myQuery.orderBy("name", "asc");
    }

    if (id !== 0) {
        myQuery.where("id", id).limit(1).offset(start).then(result => {
            res.send(JSON.stringify(result));
        });
    } else if (location !== "none") {
        myQuery.where("location", location).limit(limit).offset(start).then(result => {
            res.send(JSON.stringify(result));
        });
    } else {
        myQuery.limit(limit).offset(start).then(result => {
            res.send(JSON.stringify(result));
        });
    }
});



app.post("/doctors", function (req, res) {
    let toappend = {
        name: req.body.name,
        date: req.body.date,
        sex: req.body.sex,
        email: req.body.email,
        location: req.body.location,
        position: req.body.position,
        responsible: req.body.responsible,
        service: req.body.service
    };
    sqlDb("doctors").insert(toappend).then(ids => {
        let id = ids[0];
        res.send(_.merge({
            id,
            toappend
        }));
    });
});

// app.use(function(req, res) {
//   res.status(400);
//   res.send({ error: "400", title: "404: File Not Found" });
// });

app.set("port", serverPort);

initSqlDB();
initDb();

/* Start the server on port 5000 */
app.listen(serverPort, function () {
    console.log(`Your app is ready at port ${serverPort}`);
});
