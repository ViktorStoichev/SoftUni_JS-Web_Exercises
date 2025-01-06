import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017';

export default function mongooseInit() {
    mongoose.connect(url, { dbName: 'cosmic-explorer' })
        .then(() => console.log('Connected to database!'))
        .catch((err) => console.log(`Failed to connect to database: ${err}`));
}