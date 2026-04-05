require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb');
        const counts = await Product.aggregate([
            { $group: { _id: "$serviceType", count: { $sum: 1 } } }
        ]);
        console.log('Product Counts by Service Type:');
        console.log(JSON.stringify(counts, null, 2));

        const foodSample = await Product.findOne({ serviceType: 'Food' });
        console.log('Food Sample:', foodSample ? 'Found' : 'Missing');

        const rideSample = await Product.findOne({ serviceType: 'Ride' });
        console.log('Ride Sample:', rideSample ? 'Found' : 'Missing');

        process.exit(0);
    } catch (err) {
        console.error('DB Check Failed:', err.message);
        process.exit(1);
    }
}

checkDB();
