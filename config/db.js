const mongoose = require('mongoose');

const baseURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(baseURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log("Database connected successfully!");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB
