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
    console.log('Connected to MongoDB for Mega-Seed V4 (Midnight Professional)...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Business.deleteMany();
    await Question.deleteMany();
    await Booking.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Prajesh Admin',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    const businessData = [
        { name: 'Onyx Electronics', type: 'Warehouse', tags: ['Tech', 'Gadgets'] },
        { name: 'Midnight Pizza', type: 'Restaurant', tags: ['Italian', 'Pizza', 'Fast Food'], cost: 1200 },
        { name: 'Saffron Spice Hub', type: 'Restaurant', tags: ['Indian', 'Curry', 'Luxury'], cost: 1500 },
        { name: 'Organic Orchard', type: 'GroceryStore', tags: ['Organic', 'Vegetables', 'Fresh'] },
        { name: 'Care Hub Pharmacy', type: 'Pharmacy', tags: ['Medicine', 'Healthcare'] },
        { name: 'Luxe Stays & Resorts', type: 'Stay', tags: ['Luxury', 'Resort', 'Swimming'], cost: 15000 },
        { name: 'Elite Ride Network', type: 'Ride', tags: ['Sedan', 'SUV', 'Electric'], cost: 50 },
        { name: 'Aura Home Services', type: 'HomeService', tags: ['Plumbing', 'Electrical', 'Cleaning'], cost: 800 }
    ];

    const businesses = [];
    for (const b of businessData) {
        const created = await Business.create({
            name: b.name,
            businessType: b.type,
            owner: admin._id,
            tags: b.tags,
            rating: 4.8,
            numReviews: 250,
            avgCostForTwo: b.cost,
            location: { city: 'Mumbai', address: 'Bandra West, Mumbai' }
        });
        businesses.push(created);
    }

    const serviceConfigs = {
      Shopping: {
        categories: ['Electronics', 'Computing', 'Smart Home', 'Fashion', 'Sports'],
        images: ['1498049794561-7780e7231661', '1523275335684-259463b27670'],
        manufacturers: ['Premium Core', 'Aura Tech', 'Midnight Labs'],
        specKeys: ['Power', 'Connectivity', 'Weight']
      },
      Food: {
        categories: ['Burger', 'Pizza', 'Sushi', 'Indian', 'Italian'],
        images: ['1504674900247-0877df9cc836', '1513104890138-7c749659a591'],
        manufacturers: ['Midnight Kitchen', 'Royal Tastes', 'Artisan Bites'],
        specKeys: ['Calories', 'Portion', 'IsVeg', 'Spiciness']
      },
      Grocery: {
        categories: ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Drinks'],
        images: ['1610832958506-ee5633842b99', '1542838132-92c53300491e'],
        manufacturers: ['Organic Harvest', 'Pure Earth', 'Fresh Link'],
        specKeys: ['Weight', 'Organic', 'Expiry', 'Storage']
      },
      Pharmacy: {
        categories: ['Medicine', 'Personal Care', 'Supplements', 'Devices'],
        images: ['1584308661274-219ffec907a3', '1512069772995-ec65ed4563c1'],
        manufacturers: ['Vitality Pharm', 'BioGuard', 'CureAll'],
        specKeys: ['Dosage', 'Form', 'Age Group']
      },
      Stay: {
        categories: ['Suites', 'Rooms', 'Villas', 'Resorts', 'Cabins'],
        images: ['1566073771259-6a8506099945', '1542314831-068cd1dbfeeb'],
        manufacturers: ['Luxury Escapes', 'Onyx Hotels', 'Elite Stays'],
        specKeys: ['Beds', 'Amenities', 'Cancellation', 'View']
      },
      Ride: {
        categories: ['Bike (Rapido)', 'Auto (Ola)', 'Mini', 'Prime', 'SUV'],
        images: ['1558981403-c5f9899a28bc', '1494976388531-d11e99a58cbf'],
        manufacturers: ['Elite Move', 'Quick Link', 'Urban Pilot'],
        specKeys: ['Capacity', 'Fuel', 'Climate', 'Safety']
      },
      HomeService: {
        categories: ['Plumbing', 'Electrical', 'Cleaning', 'Salon', 'AC Repair'],
        images: ['1581578731548-c64695ce6958', '1621905251189-08b45d6a269e'],
        manufacturers: ['Aura Genius', 'Master Fix', 'Professional Care'],
        specKeys: ['Exp', 'Certified', 'Equipment', 'Warranty']
      }
    };

    const imagePool = {
      Electronics: ['1498049794561-7780e7231661', '1525547718571-01104c2ff545', '1496181133206-80ce9b88a853'],
      Computing: ['1517694712202-14dd9538aa97', '1531297484001-80022131f5a1', '1550745165-9bc0b252726f'],
      Fashion: ['1445205170230-053b83016050', '1483985988355-763728e1935b'],
      Sports: ['1517836357463-d25dfeac3438', '1461896704075-840135e80dc6'],
      Burger: ['1568901346375-23c9450c58cd', '1571091723284-1c713b3c376f', '1550547660-d9450f859349'],
      Pizza: ['1513104890138-7c749659a591', '1574126154517-d1e0d89ef734', '1593560708920-61dd98c46a4e'],
      Sushi: ['1553621042-f6e147245754', '1579871494447-9811cf80d66c'],
      Indian: ['1585937421612-7110eec2680a', '1517248135467-4c7edcad34c4'],
      Italian: ['1513104890138-7c749659a591', '1550583724-741fe2756616'],
      Fruits: ['1610832958506-ee5633842b99', '1495480137269-ff29bd0a2ac4'],
      Vegetables: ['1566385102311-63a12a0f5d4a', '1597362925123-77861d3eeac7'],
      Dairy: ['1550583724-741fe2756616', '1628088062839-2a6c888bd5f1'],
      'Bike (Rapido)': ['1558981403-c5f9899a28bc', '1558981424-51000b215a77'],
      'Auto (Ola)': ['1558981403-c5f9899a28bc', '1493236295711-94efd573f9f5'],
      Mini: ['1549317661-1dadf8fe95a2', '1494905998402-415d29393d31'],
      Prime: ['1533473359331-0135ef1b58bf', '1492144531285-b28613939981'],
      SUV: ['1542281286-9e0a16bb7366', '1567676211048-de048d082695'],
      Villas: ['1564013799919-ab600027ffc6', '1580582932707-209a221f476a'],
      Resorts: ['1542314831-068cd1dbfeeb', '1566073771259-6a8506099945'],
      Suites: ['1590490360182-c31d8076043d', '1540518614-b4131df0bc63'],
      Cleaning: ['1581578731548-c64695ce6958', '1621905251189-08b45d6a269e'],
      Electrical: ['1621905251189-08b45d6a269e', '1581092120530-612660ec0f15'],
      Repair: ['1581092120530-612660ec0f15', '1621905251189-08b45d6a269e']
    };

    const serviceTypes = Object.keys(serviceConfigs);
    const itemsPerService = 60; // 60 items per vertical x 7 = 420 products
    const batchSize = 10;

    for (const service of serviceTypes) {
        console.log(`📡 Elegant Expansion: ${service}...`);
        const config = serviceConfigs[service];
        
        for (let i = 0; i < itemsPerService; i += batchSize) {
            const batch = [];
            for (let j = 0; j < Math.min(batchSize, itemsPerService - i); j++) {
                const cat = config.categories[Math.floor(Math.random() * config.categories.length)];
                
                let imgPool = imagePool[cat] || imagePool[service] || config.images;
                const activeImg = imgPool[j % imgPool.length];
                
                const biz = businesses.find(b => {
                    if (service === 'Food') return b.businessType === 'Restaurant';
                    if (service === 'Grocery') return b.businessType === 'GroceryStore';
                    if (service === 'Pharmacy') return b.businessType === 'Pharmacy';
                    if (service === 'Stay') return b.businessType === 'Stay';
                    if (service === 'Ride') return b.businessType === 'Ride';
                    if (service === 'HomeService') return b.businessType === 'HomeService';
                    return b.businessType === 'Warehouse';
                }) || businesses[0];

                const productId = new mongoose.Types.ObjectId();
                
                const metadata = {
                  ingredients: service === 'Food' ? ['Organic Saffron', 'Kobe Beef', 'Truffle Oil', 'Artisanal Flour', 'Exotic Herbs'] : [],
                  recipe: service === 'Food' ? 'Our master chef fuses traditional methods with modern gastronomy. Prepared in a high-pressure obsidian vessel for maximum flavor retention.' : null,
                  amenities: service === 'Stay' ? ['Infinite Pool', ' butler service', 'Smart Control', 'AC Elite', 'Wine Cellar', 'Private Gym', 'Golden Breakfast', 'Panoramic View'] : [],
                  views: service === 'Stay' ? [
                    `https://images.unsplash.com/photo-${imgPool[(j+1)%imgPool.length]}?w=800&q=80`,
                    `https://images.unsplash.com/photo-${imgPool[(j+2)%imgPool.length]}?w=800&q=80`,
                    `https://images.unsplash.com/photo-${imgPool[0]}?w=800&q=80`
                  ] : [],
                  hasAC: true,
                  maxGuests: service === 'Stay' ? Math.floor(Math.random() * 6) + 2 : null,
                  isBestSeller: Math.random() > 0.7,
                  timeToDeliver: service === 'Grocery' ? '12 mins' : (service === 'Food' ? '20 mins' : (service === 'Ride' ? '2 mins' : 'Instant'))
                };

                batch.push({
                    _id: productId,
                    name: `${cat} ${service} Elite ${i + j + 1}`,
                    description: `The pinnacle of ${cat} service. Every detail refined for elegance and functionality. Part of the Midnight Professional series.`,
                    price: service === 'Stay' ? Math.floor(Math.random() * 50000) + 5000 : Math.floor(Math.random() * 2000) + 200,
                    category: cat,
                    serviceType: service,
                    brand: config.manufacturers[Math.floor(Math.random() * config.manufacturers.length)],
                    images: [`https://images.unsplash.com/photo-${activeImg}?w=1200&q=90`],
                    stock: Math.floor(Math.random() * 100) + 10,
                    rating: (Math.random() * 0.5 + 4.5).toFixed(1),
                    numReviews: Math.floor(Math.random() * 2000) + 500,
                    specifications: { "Protocol": "Elite", "Series": "Onyx", "Status": "Certified" },
                    business: biz._id,
                    isPrime: true,
                    ...metadata
                });
            }
            try {
                await Product.insertMany(batch);
                process.stdout.write('⚡');
            } catch (err) {
                console.error('\nSync Failure:', err.message);
            }
            await sleep(200); 
        }
        console.log(`\nVertical Synchronized: ${service}`);
    }

    console.log('\n--- ALL SYSTEMS OPERATIONAL: MEGA-SEED V4 (MIDNIGHT) COMPLETE ---');
    process.exit();
  } catch (err) {
    console.error('Fatal Cluster Connection Error:', err);
    process.exit(1);
  }
};

seedMegaData();