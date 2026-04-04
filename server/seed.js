require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Business = require('./models/Business');
const Question = require('./models/Question');

const seedMegaData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb';
    const options = {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      family: 4 
    };
    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB for Mega-Service Scaling...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Business.deleteMany();
    await Question.deleteMany();

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

    const serviceConfigs = {
      Shopping: {
        categories: ['Electronics', 'Computing', 'Smart Home', 'Fashion', 'Sports'],
        images: ['1498049794561-7780e7231661', '1517694712202-14dd9538aa97'],
        manufacturers: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
        specKeys: ['Power', 'Connectivity', 'Warranty', 'Weight']
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
        categories: ['Medicine', 'Personal Care', 'Supplements', 'Health Hub', 'Devices'],
        images: ['1584308661274-219ffec907a3', '1512069772995-ec65ed4563c1'],
        manufacturers: ['Pfizer', 'GSK', 'Cipla', 'HealthCare+'],
        specKeys: ['Dosage', 'Form', 'Contraindications', 'Age Group']
      }
    };

    const serviceTypes = ['Shopping', 'Food', 'Grocery', 'Pharmacy'];
    const itemsPerService = 5000;
    const batchSize = 250;

    console.log(`Generating ${serviceTypes.length * itemsPerService} items across all services...`);

    for (const service of serviceTypes) {
        console.log(`Seeding ${service} vertical...`);
        const config = serviceConfigs[service];
        
        for (let i = 0; i < itemsPerService; i += batchSize) {
            const batch = [];
            for (let j = 0; j < Math.min(batchSize, itemsPerService - i); j++) {
                const cat = config.categories[Math.floor(Math.random() * config.categories.length)];
                const img = config.images[Math.floor(Math.random() * config.images.length)];
                const biz = businesses.find(b => {
                    if (service === 'Food') return b.businessType === 'Restaurant';
                    if (service === 'Grocery') return b.businessType === 'GroceryStore';
                    if (service === 'Pharmacy') return b.businessType === 'Pharmacy';
                    return b.businessType === 'Warehouse';
                }) || businesses[0];

                const specs = {};
                config.specKeys.forEach(key => {
                    specs[key] = `Standard ${key} Spec Value`;
                });

                batch.push({
                    name: `${cat} ${service} Item #${i + j + 1}`,
                    description: `Premium quality ${cat} from the ${service} catalog. Designed for excellence.`,
                    price: Math.floor(Math.random() * 5000) + 100,
                    category: cat,
                    serviceType: service,
                    brand: config.manufacturers[Math.floor(Math.random() * config.manufacturers.length)],
                    manufacturer: config.manufacturers[Math.floor(Math.random() * config.manufacturers.length)],
                    images: [`https://images.unsplash.com/photo-${img}?w=600&q=80`],
                    stock: Math.floor(Math.random() * 500) + 10,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    numReviews: Math.floor(Math.random() * 2000),
                    specifications: specs,
                    timeToDeliver: service === 'Grocery' ? '15 mins' : (service === 'Food' ? '30-45 mins' : '2-4 Days'),
                    business: biz._id,
                    isPrime: Math.random() > 0.3
                });
            }
            const createdProducts = await Product.insertMany(batch);

            // Generate some reviews for each product in the batch
            const topProducts = createdProducts.slice(0, 5); 
            for (const p of topProducts) {
                await Review.create({
                    product: p._id,
                    user: admin._id,
                    name: 'Mega User',
                    rating: 5,
                    comment: 'Absolutely fantastic quality!',
                    isVerified: true
                });

                await Question.create({
                    product: p._id,
                    user: admin._id,
                    question: `Is this ${p.name} good for long term use?`,
                    answer: 'Yes, it is highly durable and highly recommended by experts.',
                    isAnswered: true
                });
            }
        }
        console.log(`${service} vertical seeded successfully.`);
    }

    console.log('Final Verification: Seeding Complete!');
    process.exit();
  } catch (err) {
    console.error('Mega-Seeding error:', err.message);
    process.exit(1);
  }
};

seedMegaData();