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
				filename: "./database.sqlite"
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


function initServicesLocationDB(){
    return sqlDb.schema.hasTable("serviceslocations").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("serviceslocations", table => {
					table.string("service");
					table.string("location");
				})
				.then(() => {
					return Promise.all(
						_.map(serviceslocationsList, p => {
							return sqlDb("serviceslocations").insert(p);
						})
					);
				});
		} else {
			return true;
		}
	});
    
}

app.get("/serviceslocations", function(req, res){
    
    console.log("Sono nella get di serviceslocations");
    let service = _.get(req, "query.service", "none");
    console.log("service: " + service)
    let location = _.get(req, "query.location", "none");
    console.log("location: " + location);
    let myQuery = sqlDb("serviceslocations");
    let myQuery1 = sqlDb("services");
    
    
    if(service != "none"){
        if(location != "none"){
            console.log("Error, I won't send anything");
        }
        else{
            console.log("Qui ci sono tutte le location")
            //prendo tutte le location relativo a quella service
            myQuery.where("service", service).join('services', 'services.name', '=', "serviceslocations.service").then(result =>{
                res.send(JSON.stringify(result));      
            });
        }   
    }else{
        if(location != "none"){
            console.log("tutti i servizi");
            myQuery.where("location", location).join('services', 'services.name', '=', 'serviceslocations.service').then(result =>{
                res.send(JSON.stringify(result));
            });
        }else{
            console.log("Sono nell'ultimo else");
            let empty=[];
            res.send(JSON.stringify(empty));
        }
    }
});

function initDoctorsDB() {
	return sqlDb.schema.hasTable("doctors").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("doctors", table => {
					table.integer("id");
					table.string("name");
					table.integer("date").unsigned();
					table.enum("sex", ["male", "female"]);
					table.string("email");
					table.string("location");
					table.string("position");
					table.string("responsible");
					table.string("service");
				})
				.then(() => {
					return Promise.all(
						_.map(doctorsList, p => {
							delete p.id;
							return sqlDb("doctors").insert(p);
						})
					);
				});
		} else {
			return true;
		}
	});
}

const _ = require("lodash");
const array = require("lodash/array");

let serverPort = process.env.PORT || 5000;

let doctorsList = require("./doctorstoredata.json");
let locationsList = require("./locationsdata.json");
let reservationsList = require("./reservations.json");
let servicesList = require("./servicesdata.json");
let serviceslocationsList = require("./serviceslocations.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// /* Register REST entry point */

app.get("/doctors", function (req, res) {

	let start = parseInt(_.get(req, "query.start", 0));
	let limit = parseInt(_.get(req, "query.limit", 10));
	let sortby = _.get(req, "query.sort", "none");
	let id = parseInt(_.get(req, "query.id", 0));
	let location = _.get(req, "query.location", "none");
    let service = _.get(req,"query.service","none");
	let myQuery = sqlDb("doctors");

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
	} else if (service !== "none") {
		myQuery.where("service", service).limit(limit).offset(start).then(result => {
			res.send(JSON.stringify(result));
		});
	}else {
		myQuery.limit(limit).offset(start).then(result => {
			res.send(JSON.stringify(result));
		});
	}
});




app.post("/doctors", function (req, res) {
	let toappend = {
        id: req.body.id,
		name: req.body.name,
		sex: req.body.sex,
		date: req.body.date,
		phone: req.body.phone,
		email: req.body.email,
		location: req.body.location,
		area: req.body.area,
		service: req.body.service
	};
	sqlDb("doctors").insert(toappend);
});

// app.use(function(req, res) {
//   res.status(400);
//   res.send({ error: "400", title: "404: File Not Found" });
// });

app.set("port", serverPort);

function initServicesDb(){
    return sqlDb.schema.hasTable("services").then( exists => {
        if(!exists){
            sqlDb.schema.createTable("services", table => {
                table.increments();
                table.string("name");
                table.integer("referring_doctor_id");
                table.json("locations");
                table.string("description");
                table.string("img");
            }).then(()=> {
                return Promise.all(
                    _.map(servicesList, p => {                 
                        delete p.id;
                        p.locations = JSON.stringify(p.locations);
                        return sqlDb("services").insert(p);
                    })
                );
            });
        } else {
            return true;
        }
        
    });
}

app.get("/services", function(req,res){  
    console.log("Nella get");
    let name = _.get(req, "query.name", "none");
    let myQuery = sqlDb("services");
    
    if(name != "none"){
        myQuery.where("name", name).then((result) =>{
            res.send(JSON.stringify(result));
        });
    }else{
        myQuery.then((result)=> {
        res.send(JSON.stringify(result));
        });
    }
    console.log("fine get");
});

function initLocationDb() {
	return sqlDb.schema.hasTable("locations").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("locations", table => {
					table.increments();
					table.string("city");
					table.string("address");
					table.integer("cap");
					table.string("phone");
					table.text("description");
					table.text("img");
					table.text("map");
				})
				.then(() => {
					return Promise.all(

						_.map(locationsList, p => {

							delete p.id;
							return sqlDb("locations").insert(p);
						})
					);
				});
		} else {
			return true;
		}
	});
}


app.get("/locations", function (req, res) {

	console.log("sono nella get con start");
	let city = _.get(req, "query.city", "none"); //is the last parameter the default value
	let myQuery = sqlDb("locations");


	if (city !== "none") {
		myQuery.where("city", city).then(result => {
			res.send(JSON.stringify(result));
		});

	} else {
		console.log("sono qua dentro");
		myQuery.then(result => {
			res.send(JSON.stringify(result));
		});
	}
});



function initReservationsDb() { //we first have to specify the schema of the database
	return sqlDb.schema.hasTable("reservations").then(exists => {
		if (!exists) { //if it does not exist we're gonna populate it
			sqlDb.schema
				.createTable("reservations", table => { //this function creates the table
					//each new row numbers itself automatically, this is a sort of id
					table.increments();
					table.string("name"); //specifiying fields of the table
					table.string("email");
					table.string("phone");
					table.text("notes");
				})
				.then(() => { //we populate with the data we had last time
					return Promise.all(
						//ritorna la lista di promises
						_.map(reservationsList, loc => {

							delete loc.reservations;
							return sqlDb("reservations").insert(loc); //every insert returns a promise, we need a wwait to wait for all the promises, we use a std javascript function (promise.all)
						})
					);
				});
		} else {
			return true;
		}
	});
}

app.post("/reservations", function (req, res) {
	let toappend = {
		id: req.body.id,
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		notes: req.body.notes,

	};
	sqlDb("reservations").insert(toappend).then(ids => {
		let id = ids[0];
		res.send(_.merge({
			id,
			toappend
		}));
	});
});



/* Start the server on port 5000 */
app.listen(serverPort, function () {
	console.log(`Your app is ready at port ${serverPort}`);
});

initSqlDB();
initDoctorsDB();
initLocationDb();
initServicesDb();
initReservationsDb();
initServicesLocationDB();