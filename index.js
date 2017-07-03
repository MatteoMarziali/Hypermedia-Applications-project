/*
 *-----------------------------------------------------------------------------------------------------------------------
 *   Initializing variables and base setup
 */


//Requiring all the needed libraries
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex"); //it's like a factory function, it creates the connection
const process = require("process");
const _ = require("lodash");
const array = require("lodash/array");

//Setting the port used to communicate
let serverPort = process.env.PORT || 5000

//Here we require all the json files that store
//the data we are importing in the database
let doctorsList = require("./doctorstoredata.json");
let locationsList = require("./locationsdata.json");
let servicesList = require("./servicesdata.json");
let serviceslocationsList = require("./serviceslocations.json");

//The following is used to serve static files and our starting point is
//"__dirname + "/public" where __dirname defines the directory name of the current module
app.use(express.static(__dirname + "/public"));

//Using the body parser to extract the body portion of the request and to expose
//it req body as something easier to interface with
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


//This variable will store the initialized DB client
let sqlDb;


/*
 *-------------------------------------------------------------------------------------------------------------------------
 *   Defining functions
 */


/*
 * The following function initializes the database client
 * based on an environment variable "TEST" that will
 * define whether to use sqlite3 or postgres as the
 * db client (this is required for heroku deployment)
 */
function initSqlDB() {

	if (process.env.TEST) { //Locally we are using sqlite3, so we need to type "set test=TRUE" in the
		sqlDb = sqlDbFactory({ //command prompt to make the server work with sqlite3
			client: "sqlite3",
			debug: true,
			connection: {
				filename: "./database.sqlite"
			}
		});
	} else {
		sqlDb = sqlDbFactory({ //Heroku will use postgres as its database client
			debug: true,
			client: "pg",
			connection: process.env.DATABASE_URL,
			ssl: true
		});
	}
}

/*
 * This function initializes the docotrs table. 
 * At first it checks if the Database of the webapp already has a table called "doctors", if it doesn't
 * it's going to be created with the specified fields and populated with data obtained by its relative JSON file.
 * 
 */

function initDoctorsDB() {
	return sqlDb.schema.hasTable("doctors").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("doctors", table => {
					table.integer("idd");
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



// /* Register REST entry point for Doctors */
/*
 * We use the following function to get the doctors requested by the query.
 * Only the needed queries were implemented: the query to get a single doctor by its id,
 * the one which returns the JSON list of all doctors working in a specific location or 
 * in a specific service. If none of this fields are specified in the query, a JSON
 * containing all doctors is returned.
 */

app.get("/doctors", function (req, res) {

	console.log("sono nella get con start");
	let start = parseInt(_.get(req, "query.start", 0));
	let limit = parseInt(_.get(req, "query.limit", 10));
	let sortby = _.get(req, "query.sort", "none");
	let id = parseInt(_.get(req, "query.id", 0));
	let location = _.get(req, "query.location", "none");
	let service = _.get(req, "query.service", "none");
	let myQuery = sqlDb("doctors");

	if (sortby === "age") {
		myQuery = myQuery.orderBy("date", "asc");
	} else if (sortby === "-age") {
		myQuery = myQuery.orderBy("date", "desc");
	} else if (sortby === "name") {
		myQuery = myQuery.orderBy("name", "asc");
	}

	if (id !== 0) {
		myQuery.where("idd", id).limit(1).offset(start).then(result => {
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
	} else {
		myQuery.limit(limit).offset(start).then(result => {
			res.send(JSON.stringify(result));
		});
	}
});





/*
 * This function initializes the services table. First of all I inserted 
 * in a json format file all the data related to services and required it.
 * Then the function checks if the services table already exists, creating
 * it if it doesn't and adds all the data located in the json file in the database.
 */
function initServicesDb() {

	//We use here the code the professor suggested us during the lessons
	return sqlDb.schema.hasTable("services").then(exists => {
		if (!exists) {
			sqlDb.schema.createTable("services", table => {
				table.string("name");
				table.integer("referring_doctor_id");
				table.json("locations");
				table.string("description");
				table.string("img");
			}).then(() => {
				return Promise.all(
					_.map(servicesList, p => {
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

/*
 * We use the following function to get the services requested.
 * if the query specifies a service name, the function returns
 * that specific service otherwise it returns all the elements 
 * in the table.
 */
app.get("/services", function (req, res) {

	let name = _.get(req, "query.name", "none"); //This function gets the value of the name attribute of the query
	let myQuery = sqlDb("services"); //using "none" as default

	if (name != "none") {
		myQuery.where("name", name).then((result) => { //This extracts all the elements that have the same name as the
			res.send(JSON.stringify(result)); //one passed to the query, and sends the data in response
		});
	} else {
		myQuery.then((result) => { //this section returns all the elements of the "services" table
			res.send(JSON.stringify(result));
		});
	}
});

/*
 * This function initializes the locations table. First of all I inserted 
 * in a json format file all the data related to services and required it.
 * Then the function checks if the locations table already exists, creating
 * it if it doesn't and adds all the data located in the json file in the database.
 */
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

/*
 * We use the following function to get the locations requested.
 * if the query specifies a location city, the function returns
 * that specific location otherwise it returns all the elements 
 * in the table.
 */
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

/*
 * The following function initializes the services-locations table that
 * contains couples "service, location" representing the relation between
 * them. We thougt this was necessary because one service can be delivered
 * in more than one location and one location can deliver more than one 
 * service and in order to maintain the schemas relational we adopted
 * this strategy. This table will be needed for example to show al the locations
 * related to a service and vice versa and it will be joined (with k'nex join function)
 * with services table in order to get any service information given the location and vice versa.
 */
function initServicesLocationDB() {

	//We use here the code suggested by the professor during the lessons
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


/*
 * Function that gets all the services given a specific location and vice versa.
 * if the query specifies both the service and the location we decided to return 
 * an empty json, and the same happens if the query doesn't specify any of them
 * because we wanted to keep the purpose of this get in getting all the services
 * given a location and the way back and this happens if the query specifies only
 * the location or the service.
 */
app.get("/serviceslocations", function (req, res) {

	let service = _.get(req, "query.service", "none"); //This variable stores the value of the service passed to the query
	let location = _.get(req, "query.location", "none"); //This one the location
	let myQuery = sqlDb("serviceslocations");
	let empty = [];

	if (service != "none") { //if both the variables are different from 'none' then we return anything
		if (location != "none") {
			res.send(JSON.stringify(empty));
		} else {
			//This query gets all the services with the service value specified by the query and joins it with the service 
			//table to get all the service information that we required in our pages
			myQuery.where("service", service).join('services', 'services.name', '=', "serviceslocations.service").then(result => {
				res.send(JSON.stringify(result));
			});
		}
	} else {
		if (location != "none") {
			//The same happens here, the only difference is that we select here the tuples that have the same location as the
			//one passed to the query
			myQuery.where("location", location).join('services', 'services.name', '=', 'serviceslocations.service').then(result => {
				res.send(JSON.stringify(result));
			});
		} else {
			res.send(JSON.stringify(empty));
		}
	}
});


//The following function creates a reservations table in the database, to save the booking requests.
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
						//returns the promises list
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

//this function inserts in the reservations table the data filled in the reservation form to keep the bookings history. 
app.post("/reservations", function (req, res) {
	let toappend = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		notes: req.body.notes

	};
	sqlDb("reservations").insert(toappend).then(ids => {
		let id = ids[0];
		res.send(_.merge({
			id,
			toappend
		}));
	});
});

//This function manages the request to see the bookings history and sends the reponse in JSON format.
app.get("/reservations", function (req, res) {


	console.log("sono nella get con start");
	let myQuery = sqlDb("reservations");

	myQuery.then(result => {
		res.send(JSON.stringify(result));

	});
});


/*
 *---------------------------------------------------------------------------------------------------------------------------------
 *   Calling functions
 */

app.set("port", serverPort);

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
