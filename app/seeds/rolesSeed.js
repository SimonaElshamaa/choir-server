/* mySeedScript.js */
//run it :  node app/seeds/rolesSeed.js 
// require the necessary libraries
const MongoClient = require("mongodb").MongoClient;

async function seedDB() {
    // Connection URL
    const uri = "mongodb://localhost:27017/choir";

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection = client.db("choir").collection("roles");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();

        // make a bunch of time series data
        let rolesData = [
            {index:1, name:"admin" ,code:1000}, 
            {index:2, name:"first prep saturday" ,code:1001},
            {index:3, name:"second prep saturday" ,code:1002},
            {index:4, name:"first primary sunday" ,code:1003},
            {index:5, name:"secound primary sunday" ,code:1004},
            {index:6, name:"secondry monday" ,code:1005},
            {index:7, name:"youth tuesday" ,code:1006},
            {index:8, name:"youth wednesday" ,code:1007},
            {index:9, name:"kids wednesday" ,code:1008}
        ];
        collection.insertMany(rolesData);

        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();