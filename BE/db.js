const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/teacherDB');
    console.log('Connected to MongoDB');
    
    // const Teacher = mongoose.model('Teacher', {
    //     name: String,
    //     subject: String,
    //     free: Number,
    // });
    // for (let i = 0; i < 50; i++) {
    //     const newTeacher = new Teacher({
    //         name: 'John Doe' + i,
    //         subject: i % 5 ? 'A' : 'B',
    //         free: 1,
    //     });

    //     try {
    //         const result = await newTeacher.save();
    //         console.log('Teacher inserted:');
    //     } catch (error) {
    //         console.error('Error inserting teacher:', error);
    //     }
    // }
}
// connectDB()
module.exports = connectDB


// const Teacher = mongoose.model('Teacher', {
//     name: String,
//     subject: String,
//     free: Number,
// });


// for(let i=0;i<50;i++)
// {
//     const newTeacher = new Teacher({
//         name: 'John Doe'+i,
//         subject: i%2? 'A': 'B',
//         free: 1,
//     });

//     try {
//         const result = await newTeacher.save();
//         console.log('Teacher inserted:');
//     } catch (error) {
//         console.error('Error inserting teacher:', error);
//     }
// }


// Find all documents in the 'teachers' collection after insertion
// const teachers = await Teacher.find();
// // Print the updated documents
// console.log('Teachers after insertion:', teachers);
// // Close the Mongoose connection
// await mongoose.connection.close();
// console.log('Connection closed');



