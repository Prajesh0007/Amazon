require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Business = require('./models/Business');
const Question = require('./models/Question');
const Booking = require('./models/Booking');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const seedMegaData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb';
    const options = {
      serverSelectionTimeoutMS: 120000,
      socketTimeoutMS: 120000,
      connectTimeoutMS: 120000,
      family: 4 
    };
    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB for 7-Vertical Super App Expansion...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Business.deleteMany();
    await Question.deleteMany();
    await Booking.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    const businessData = [
        { name: 'Elite Electronics Hub', type: 'Warehouse', tags: ['Tech', 'Gadgets'] },
        { name: 'Pizza Paradise', type: 'Restaurant', tags: ['Italian', 'Pizza', 'Fast Food'], cost: 500 },
        { name: 'Spice Route', type: 'Restaurant', tags: ['Indian', 'Curry', 'Spicy'], cost: 400 },
        { name: 'Healthy Greens', type: 'GroceryStore', tags: ['Organic', 'Vegetables', 'Fresh'] },
        { name: 'Pharma 24/7', type: 'Pharmacy', tags: ['Medicine', 'Healthcare'] },
        { name: 'Quick Mart', type: 'GroceryStore', tags: ['Snacks', 'Drinks', 'Essentials'] },
        { name: 'The Grand Resort', type: 'Stay', tags: ['Luxury', 'Resort', 'Swimming'], cost: 5000 },
        { name: 'Mountain View Villas', type: 'Stay', tags: ['Hills', 'Scenic', 'Villas'], cost: 3500 },
        { name: 'Uber Elite Taxi', type: 'Ride', tags: ['Sedan', 'SUV', 'Electric'], cost: 20 },
        { name: 'Handy Genius', type: 'HomeService', tags: ['Plumbing', 'Electrical', 'Cleaning'], cost: 300 }
    ];

    const businesses = [];
    for (const b of businessData) {
        const created = await Business.create({
            name: b.name,
            businessType: b.type,
            owner: admin._id,
            tags: b.tags,
            rating: 4.5,
            numReviews: 100,
            avgCostForTwo: b.cost,
            location: { city: 'Mumbai', address: 'Main Street' }
        });
        businesses.push(created);
    }

    const serviceConfigs = {
      Shopping: {
        categories: ['Electronics', 'Computing', 'Smart Home', 'Fashion', 'Sports'],
        images: ['1498049794561-7780e7231661', '1517694712202-14dd9538aa97'],
        manufacturers: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
        specKeys: ['Power', 'Connectivity', 'Weight']
      },
      Food: {
        categories: ['Burger', 'Pizza', 'Sushi', 'Indian', 'Italian'],
        images: ['1513104890138-7c749659a591', '1568901346375-23c9450c58cd'],
        manufacturers: ['Cloud Kitchen', 'Fresh Bites', 'Taste Palace'],
        specKeys: ['Calories', 'Portion', 'IsVeg', 'Spiciness']
      },
      Grocery: {
        categories: ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Drinks'],
        images: ['1542838132-92c53300491e', '1583258292688-d50039880a11'],
        manufacturers: ['Farm Fresh', 'Organic Co', 'Quick Mart'],
        specKeys: ['Weight', 'Organic', 'Expiry', 'Storage']
      },
      Pharmacy: {
        categories: ['Medicine', 'Personal Care', 'Supplements', 'Devices'],
        images: ['1584308661274-219ffec907a3', '1512069772995-ec65ed4563c1'],
        manufacturers: ['Pfizer', 'GSK', 'Cipla', 'HealthCare+'],
        specKeys: ['Dosage', 'Form', 'Age Group']
      },
      Stay: {
        categories: ['Suites', 'Rooms', 'Villas', 'Resorts', 'Cabins'],
        images: ['1566073771259-6a8506099945', '1542314831-068cd1dbfeeb'],
        manufacturers: ['StayWell', 'Grand Hotels', 'Peaceful Escapes'],
        specKeys: ['Beds', 'Amenities', 'Cancellation', 'View']
      },
      Ride: {
        categories: ['Sedan', 'SUV', 'Luxury', 'Shared', 'Electric'],
        images: ['1533473359331-0135ef1b58bf', '1542281286-9e0a16bb7366'],
        manufacturers: ['Mega Rides', 'Captain Drive', 'SafeTravels'],
        specKeys: ['Capacity', 'Fuel', 'Climate', 'Safety']
      },
      HomeService: {
        categories: ['Plumbing', 'Electrical', 'Cleaning', 'Salon', 'AC Repair'],
        images: ['1581578731548-c64695ce6958', '1621905251189-08b45d6a269e'],
        manufacturers: ['Urban Genius', 'HomeHero', 'Expert Fix'],
        specKeys: ['Exp', 'Certified', 'Equipment', 'Warranty']
      }
    };

    const serviceTypes = Object.keys(serviceConfigs);
    const itemsPerService = 3000; 
    const batchSize = 50; 

    console.log(`Generating ${serviceTypes.length * itemsPerService} items across 7 verticals...`);

    for (const service of serviceTypes) {
        console.log(`Seeding ${service} assets...`);
        const config = serviceConfigs[service];
        
        for (let i = 0; i < itemsPerService; i += batchSize) {
            const batch = [];
            const reviewsBatch = [];
            const questionsBatch = [];

            for (let j = 0; j < Math.min(batchSize, itemsPerService - i); j++) {
                const cat = config.categories[Math.floor(Math.random() * config.categories.length)];
                const img = config.images[Math.floor(Math.random() * config.images.length)];
                const biz = businesses.find(b => {
                    if (service === 'Food') return b.businessType === 'Restaurant';
                    if (service === 'Grocery') return b.businessType === 'GroceryStore';
                    if (service === 'Pharmacy') return b.businessType === 'Pharmacy';
                    if (service === 'Stay') return b.businessType === 'Stay';
                    if (service === 'Ride') return b.businessType === 'Ride';
                    if (service === 'HomeService') return b.businessType === 'HomeService';
                    return b.businessType === 'Warehouse';
                }) || businesses[0];

                const specs = {};
                config.specKeys.forEach(key => {
                    specs[key] = `High-Spec ${key} Value`;
                });

                const productId = new mongoose.Types.ObjectId();
                batch.push({
                    _id: productId,
                    name: `${cat} ${service} ${i + j + 1}`,
                    description: `Premium grade ${cat} asset in the ${service} ecosystem. Top rated Choice.`,
                    price: Math.floor(Math.random() * 5000) + 100,
                    category: cat,
                    serviceType: service,
                    brand: config.manufacturers[Math.floor(Math.random() * config.manufacturers.length)],
                    images: [`https://images.unsplash.com/photo-${img}?w=600&q=80`],
                    stock: Math.floor(Math.random() * 500) + 10,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    numReviews: Math.floor(Math.random() * 2000),
                    specifications: specs,
                    timeToDeliver: service === 'Grocery' ? '15 mins' : (service === 'Food' ? '30-45 mins' : (service === 'Ride' ? '5 mins' : 'Instant')),
                    business: biz._id,
                    isPrime: Math.random() > 0.3
                });

                // Generate reviews/questions for some items
                if (j % 10 === 0) {
                    reviewsBatch.push({
                        product: productId,
                        user: admin._id,
                        name: 'Verified Customer',
                        rating: 5,
                        comment: 'Truly remarkable experience with this service!',
                        isVerified: true
                    });
                    questionsBatch.push({
                        product: productId,
                        user: admin._id,
                        question: `Is this ${service} service professional?`,
                        answer: 'Absolutely, we pride ourselves on elite standards.',
                        isAnswered: true
                    });
                }
            }

            await Product.insertMany(batch);
            if (reviewsBatch.length) await Review.insertMany(reviewsBatch);
            if (questionsBatch.length) await Question.insertMany(questionsBatch);

            process.stdout.write('.');
            if ((i + batchSize) % 500 === 0) console.log(` [Seeded ${i + batchSize}/${itemsPerService}]`);
            
            await sleep(500); // Throttle for Atlas
        }
        console.log(`\n${service} successfully integrated.`);
    }

    console.log('--- ALL SYSTEMS GREEN: MEGA-SEED COMPLETE ---');
    process.exit();
  } catch (err) {
    console.error('Mega-Seeding Fatal error:', err.message);
    process.exit(1);
  }
};

seedMegaData();

seedMegaData();