const args =  require('commander');

args
    .option('--duplicates', 'Enable/disable duplicates',true)
    .option('--no-duplicates', 'Enable/disable duplicates')
    .option('-f, --file <file>', 'CSV file to load')
    .option('--password <password>', 'DB PASSWORD')
    .option('--port <port>', 'DB PORT') 
    .option('--user <port>', 'DB USER') 
    .parse(process.argv)

let DB_PASSWORD='';
if(args.password) {
	DB_PASSWORD=args.password;
    } else if( process.env.DB_PASSWORD ) {
	DB_PASSWORD= process.env.DB_PASSWORD
    } else {
	console.warn("No database password use command line option or set DB_PASSWORD variable");
	process.exit();

    }

let DB_PORT=7222
if(args.port) {
    DB_PORT=args.port;
} else if( process.env.DB_PORT ) {
    DB_PORT= process.env.DB_PORT
}


let DB_USER='postgres'
if(args.database) {
    DB_USER=args.user;
} else if( process.env.DB_USER ) {
    DB_USER= process.env.DB_USER
}

let DB_DATABASE='postgres'
if(args.database) {
    DB_DATABASE=args.database;
} else if( process.env.DB_DATABASE ) {
    DB_DATABASE= process.env.DB_DATABASE

}

let DB_HOST='localhost'
if(args.host) {
    DB_HOST=args.host;
} else if( process.env.DB_HOST ) {
    DB_HOST= process.env.DB_HOST
}


const { Pool, Client } = require('pg')
const db = new Pool({user: DB_USER,
		     host: DB_HOST,
		     database: DB_DATABASE,
		     password: DB_PASSWORD,
			 port: DB_PORT,
			});



const main =async () => {
//    db.query('select * from foo', (err, res) => {
//	console.log(err, res)
	//db.end()
    //    });
  await drop_all();
  /*
    await revenue_table();
    await disbursement_table();
    await production_table();
    await commodity_table();
    await location_table();
    await period_table();
*/

    
}

const drop_all =async () => {
    let statement=`
drop owned by current_user cascade;
-- recreate default public scheam to build in
create schema public;

`
    try {
    await db.query(statement);
    } catch (err) { console.log("drop_all: ", err);}
    
}




const production_table =async () => {
    let table=`
DROP TABLE production;
`
    try {
    await db.query(table);
    } catch (err) { console.log("disbursement_table: ", err);}
    
}

const disbursement_table =async () => {
    let table=`
DROP TABLE disbursement;
`
    try {
    await db.query(table);
    } catch (err) { console.log("disbursement_table: ", err);}
    
}

const revenue_table =async () => {
    let table=`
DROP TABLE revenue
`
    try {
    await db.query(table);
    } catch (err) { console.log("revenue_table: ", err);}
    
}

const period_table = async () => {
    let table=`
DROP TABLE period
`
    try {
    await db.query(table);
    } catch (err) { console.log("revenue_table: ", err);}

 
}



const commodity_table = async () => {
    let table=`
DROP TABLE  commodity
`
    try {
    await db.query(table);
    } catch (err) { console.log("revenue_table: ", err);}


}



const location_table = async () => {


    let table=`
DROP TABLE location 
`
        try {
    await db.query(table);
    } catch (err) { console.log("revenue_table: ", err);}

    
}

const revenue_trends = async () => {
    let view=`
DROP VIEW revenue_trends
`
    
    try {
	db.query(view);
    } catch (err) {console.debug("revenue_trends ERROR ", err.stack);}
    
    
}


main();
