const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/teacherDB');
    console.log('Connected to MongoDB');

    const Teacher = mongoose.model('Teacher', {
        name: String,
        subject: String,
        free: Number,
    });

    // Insert a new teacher document
    const newTeacher = new Teacher({
        name: 'John Doe',  
        subject: 'Math',
        free: 1,
    });

    try {
        const result = await newTeacher.save();
        console.log('Teacher inserted:', result);
    } catch (error) {
        console.error('Error inserting teacher:', error);
    }

    // Find all documents in the 'teachers' collection after insertion
    const teachers = await Teacher.find();

    // Print the updated documents
    console.log('Teachers after insertion:', teachers);

    // Close the Mongoose connection
    await mongoose.connection.close();
    console.log('Connection closed');
}
