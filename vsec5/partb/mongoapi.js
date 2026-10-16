const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("MongoDB Connected Successfully!");

        // Create or select database
        const db = client.db("CollegeDB");

        // Select collection
        const students = db.collection("students");

        // Insert student
        const result = await students.insertOne({
            name: "Mayuri",
            rollNo: 89,
            branch: "IT",
            marks: 85
        });

        console.log("Student Inserted Successfully!");
        console.log("Student ID:", result.insertedId);

        // Display all students
        const records = await students.find({}).toArray();

        console.log("Student Records:");
        console.log(records);

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await client.close();
    }
}

main();