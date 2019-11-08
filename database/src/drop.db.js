const { Pool, Client } = require('pg')
const db = new Pool({user: 'postgres',
			 host: 'localhost',
			 database: 'onrr_db',
			 password: 'secret',
			 port: 5433,
			});



let period_lookup={};
let commodity_lookup={};
let location_lookup={};

const main =async () => {
//    db.query('select * from foo', (err, res) => {
//	console.log(err, res)
	//db.end()
    //    });
    await revenue_trends();
    await revenue_table();
    await disbursement_table();
    await production_table();
    await commodity_table();
    await location_table();
    await period_table();


    
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
