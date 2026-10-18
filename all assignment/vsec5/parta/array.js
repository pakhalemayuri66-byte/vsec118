
// Array API Assignment

let students = ["Mayuri", "Priya", "Rahul"];

console.log("Original Array:", students);

// Add a student
students.push("Amit");
console.log("After Adding:", students);

// Remove the last student
students.pop();
console.log("After Removing:", students);

// Search for a student
console.log("Is Mayuri present?", students.includes("Mayuri"));

// Display all students
students.forEach(function (student) {
    console.log(student);
});