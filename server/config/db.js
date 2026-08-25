// ==========================================
// MONGODB DATABASE CONNECTION
// ==========================================

const mongoose =
    require("mongoose");


// ==========================================
// CONNECT DATABASE
// ==========================================

const connectDB = async () => {

    try {

        const mongoURI =
            process.env.MONGO_URI ||
            process.env.MONGODB_URI;


        if (!mongoURI) {

            throw new Error(
                "MongoDB connection string is missing. Check your .env file."
            );

        }


        await mongoose.connect(
            mongoURI
        );


        console.log(
            "MongoDB Connected Successfully"
        );


    } catch (error) {

        console.error(
            "MongoDB Connection Failed:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports =
    connectDB;