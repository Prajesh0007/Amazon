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

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    const categories = [
        { name: 'Electronics', query: 'electronics,gadget' },
        { name: 'Computing', query: 'laptop,computer' },
        { name: 'Audio', query: 'headphones,audio' },
        { name: 'Mobile', query: 'smartphone,mobile' },
        { name: 'Home', query: 'interior,furniture' },
        { name: 'Fashion', query: 'clothing,fashion' },
        { name: 'Books', query: 'bookshelf,library' },
        { name: 'Toys', query: 'toys,play' },
        { name: 'Sports', query: 'sports,fitness' },
        { name: 'Grocery', query: 'grocery,food' }
    ];

    const brands = {
      Electronics: ['Sony', 'Bose', 'Nintendo', 'Logitech', 'Panasonic', 'Samsung'],
      Computing: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft', 'Acer'],
      Audio: ['Sennheiser', 'JBL', 'Sonos', 'Bose', 'Beats', 'Marshall'],
      Mobile: ['Samsung', 'Google', 'OnePlus', 'Apple', 'Xiaomi', 'Oppo'],
      Home: ['Philips', 'Dyson', 'Roborock', 'Nest', 'KitchenAid', 'Shark'],
      Fashion: ['Fossil', 'Ray-Ban', 'Seiko', 'Nike', 'Adidas', 'Puma', 'Levi\'s'],
      Books: ['HarperCollins', 'Penguin', 'Bloomsbury', 'Amazon', 'Pearson'],
      Toys: ['Lego', 'Hasbro', 'Mattel', 'Disney', 'Funko'],
      Sports: ['Nike', 'Adidas', 'Under Armour', 'Wilson', 'Rawlings'],
      Grocery: ['Nestle', 'Kraft', 'PepsiCo', 'Kellogg\'s', 'General Mills']
    };

    const adjectives = ['Premium', 'Advanced', 'Ultra', 'Smart', 'Elegant', 'Essential', 'Pro', 'Classic', 'Next-Gen', 'Elite', 'Master', 'Pure', 'Dynamic'];
    
    const categoryImages = {
      Electronics: ['1498049794561-7780e7231661', '1550009158-b1486e54e487', '1526733169357-891963d72214'],
      Computing: ['1496181133206-80ce9b88a853', '1517694712202-14dd9538aa97', '1531297484001-80022131f5a1'],
      Audio: ['1505740420928-5e560c06d30e', '1484704849700-f032a568e944', '1546435770-a3e426e5397e'],
      Mobile: ['1511707171634-5f897ff02aa9', '1523206489230-c012c64b2b48', '1551817958-c115383e9cd9'],
      Home: ['1513519245088-0e12902e17cb', '1484101403033-57105d2b77ca', '1586023492125-27b2c045efd7'],
      Fashion: ['1483985988355-763728e1935b', '1539109132314-34a9c6a99975', '1445205170230-053b83e0203f'],
      Books: ['1495446815901-a7297e633e8d', '1512820790803-83ca734da794', '1519681393784-d120267933ba'],
      Toys: ['1531315630201-bb15bbeb166a', '1558060370-d644479cb6f7', '1596461407326-cd2d400481a5'],
      Sports: ['1517836357463-d25dfeac00ce', '1518611012918-fd96ef5a8195', '1516239482977-b550ba7253f2'],
      Grocery: ['1542838132-92c53300491e', '1506484334402-40ff1707d41a', '1588964895597-cfccd6e2dbf9']
    };

    console.log('Generating 100,000 minimal items...');
    const totalItems = 100000;
    const batchSize = 100; // MUCH smaller batches for Atlas Free Tier reliability

    for (let i = 0; i < totalItems; i += batchSize) {
        try {
            const batch = [];
            for (let j = 0; j < Math.min(batchSize, totalItems - i); j++) {
                const currentId = i + j + 1;
                const catObj = categories[Math.floor(Math.random() * categories.length)];
                const brand = brands[catObj.name][Math.floor(Math.random() * brands[catObj.name].length)];
                const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                
                const price = Math.floor(Math.random() * 80000) + 500;
                const rating = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));

                // Pool images for multiple views
                const imgPool = categoryImages[catObj.name];
                const img1 = imgPool[j % imgPool.length];
                const img2 = imgPool[(j + 1) % imgPool.length];
                const img3 = imgPool[(j + 2) % imgPool.length];
                const img4 = imgPool[(j + 3) % imgPool.length];

                // Minimal payload to save database size but rich enough for UI testing
                batch.push({
                    name: `${adj} ${brand} ${catObj.name.substring(0,3)}#${currentId}`,
                    description: `A fine ${brand} ${catObj.name}. Features elegant design.`,
                    price: price,
                    category: catObj.name,
                    brand: brand,
                    manufacturer: `${brand} Corporation`,
                    stock: Math.floor(Math.random() * 200) + 10,
                    rating: rating,
                    numReviews: Math.floor(Math.random() * 500) + 5,
                    images: [
                        `https://images.unsplash.com/photo-${img1}?w=400&q=80`,
                        `https://images.unsplash.com/photo-${img2}?w=400&q=80`,
                        `https://images.unsplash.com/photo-${img3}?w=400&q=80`,
                        `https://images.unsplash.com/photo-${img4}?w=400&q=80`
                    ],
                    aiSummary: {
                        summary: `Solid ${catObj.name}.`,
                        pros: ["Durable"],
                        cons: ["Pricey"],
                        verdict: "Recommended.",
                        sentimentScore: 85
                    }
                });
            }
            await Product.insertMany(batch);
            if ((i + batch.length) % 1000 === 0) {
              console.log(`Progress: ${i + batch.length} items added...`);
            }
            // Longer delay to let Atlas rest
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (batchErr) {
            console.error(`Error adding batch ${i}:`, batchErr.message);
            // Wait longer on error and try to continue
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    const finalCount = await Product.countDocuments();
    console.log(`Seeding complete! Total products in database: ${finalCount}`);
    console.log('Admin Access: admin@example.com / adminpassword123');
    process.exit();
  } catch (err) {
    console.error('Mega-Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();