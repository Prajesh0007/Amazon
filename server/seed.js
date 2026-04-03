require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb';
    const options = {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      family: 4 // Force IPv4
    };
    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB for Mega-Seeding...');

    const Business = require('./models/Business');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Business.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    const businessData = [
        { name: 'Elite Electronics Hub', type: 'Warehouse', tags: ['Tech', 'Gadgets'] },
        { name: 'Pizza Paradise', type: 'Restaurant', tags: ['Italian', 'Pizza', 'Fast Food'] },
        { name: 'Spice Route', type: 'Restaurant', tags: ['Indian', 'Curry', 'Spicy'] },
        { name: 'Healthy Greens', type: 'GroceryStore', tags: ['Organic', 'Vegetables', 'Fresh'] },
        { name: 'Pharma 24/7', type: 'Pharmacy', tags: ['Medicine', 'Healthcare'] },
        { name: 'Quick Mart', type: 'GroceryStore', tags: ['Snacks', 'Drinks', 'Essentials'] }
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
            location: { city: 'Mumbai', address: 'Main Street' }
        });
        businesses.push(created);
    }

    const categories = [
        { name: 'Electronics', serviceType: 'Shopping', specs: ['Power', 'Connectivity'] },
        { name: 'Burger', serviceType: 'Food', isVeg: false, specs: ['Calories', 'Portion'] },
        { name: 'Pizza', serviceType: 'Food', isVeg: true, specs: ['Crust', 'Toppings'] },
        { name: 'Vegetables', serviceType: 'Grocery', specs: ['Weight', 'Organic'] },
        { name: 'Medicine', serviceType: 'Pharmacy', specs: ['Dosage', 'Form'] },
        { name: 'Fashion', serviceType: 'Shopping', specs: ['Fabric', 'Fit'] }
    ];

    const serviceImages = {
        Shopping: ['1498049794561-7780e7231661', '1517694712202-14dd9538aa97'],
        Food: ['1513104890138-7c749659a591', '1568901346375-23c9450c58cd'],
        Grocery: ['1542838132-92c53300491e', '1583258292688-d50039880a11'],
        Pharmacy: ['1584308661274-219ffec907a3', '1512069772995-ec65ed4563c1']
    };

    console.log('Generating 10,000 multi-service items...');
    const totalItems = 10000;
    const batchSize = 100;

    for (let i = 0; i < totalItems; i += batchSize) {
        const batch = [];
        for (let j = 0; j < Math.min(batchSize, totalItems - i); j++) {
            const catObj = categories[Math.floor(Math.random() * categories.length)];
            const biz = businesses.find(b => {
                if (catObj.serviceType === 'Food') return b.businessType === 'Restaurant';
                if (catObj.serviceType === 'Grocery') return b.businessType === 'GroceryStore';
                if (catObj.serviceType === 'Pharmacy') return b.businessType === 'Pharmacy';
                return b.businessType === 'Warehouse';
            }) || businesses[0];

            const imgPool = serviceImages[catObj.serviceType];
            const img = imgPool[Math.floor(Math.random() * imgPool.length)];

            batch.push({
                name: `${catObj.name} Item #${i + j + 1}`,
                description: `High quality ${catObj.name} for your home and professional use.`,
                price: Math.floor(Math.random() * 2000) + 100,
                category: catObj.name,
                serviceType: catObj.serviceType,
                isVeg: catObj.isVeg ?? (Math.random() > 0.5),
                timeToDeliver: catObj.serviceType === 'Food' ? '30-45 mins' : (catObj.serviceType === 'Grocery' ? '15 mins' : '2-4 Days'),
                images: [`https://images.unsplash.com/photo-${img}?w=600&q=80`],
                business: biz._id,
                stock: 100,
                rating: 4.2
            });
        }
        await Product.insertMany(batch);
        if (i % 1000 === 0) console.log(`Progress: ${i} items added...`);
    }

    console.log('Seeding complete! Platform is now a Super App ecosystem.');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();