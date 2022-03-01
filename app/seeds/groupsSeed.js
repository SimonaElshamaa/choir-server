/* mySeedScript.js */
//run it :  node app/seeds/groupsSeed.js 
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

        const collection = client.db("choir").collection("groups");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();

        // make a bunch of time series data
        let groupsData = [
            {identifier:2, name:"first prep saturday"},
            {identifier:3, name:"second prep saturday"},
            {identifier:4, name:"first primary sunday"},
            {identifier:5, name:"secound primary sunday"},
            {identifier:6, name:"secondry monday"},
            {identifier:7, name:"youth tuesday"},
            {identifier:8, name:"youth wednesday"},
            {identifier:9, name:"kids wednesday"}
        ];
        collection.insertMany(groupsData);

        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();