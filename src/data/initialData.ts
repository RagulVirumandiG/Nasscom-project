import { Product, Category, Coupon, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Smartphones, Laptops, Headphones, & Gadgets',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Men & Women Apparel, Shoes, & Accessories',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grocery',
    name: 'Grocery',
    description: 'Fresh Organic Produce, Pantry Staples, & Drinks',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Skincare, Makeup, Haircare, & Cosmetics',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness Equipment, Activewear, & Outdoor Gear',
    icon: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Appliances, Furniture, Decor, & Cookware',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Fiction, Non-fiction, Self-help, & Tech Guides',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'SonicPro Wireless Noise-Canceling Headphones',
    brand: 'AuraSound',
    category: 'Electronics',
    price: 199,
    originalPrice: 249,
    discount: 20,
    description: 'Experience immersive audio with active noise cancellation, 40-hour battery life, spatial audio processing, and soft leather memory foam ear cushions.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Midnight Black', 'Silver Frost', 'Navy Blue'],
    stock: 28,
    rating: 4.8,
    numReviews: 142,
    isFlashSale: true,
    isBestSeller: true,
    isRecommended: true,
    createdAt: new Date().toISOString(),
    reviews: [
      {
        id: 'rev-1',
        userId: 'u2',
        userName: 'Alex Rivers',
        rating: 5,
        title: 'Outstanding sound quality and comfort!',
        comment: 'The noise cancellation completely blocks airplane background noise. Battery lasts forever.',
        date: '2026-07-20',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userId: 'u3',
        userName: 'Sophia Chen',
        rating: 4.5,
        title: 'Great headphones for work and travel',
        comment: 'Super comfortable to wear for 8 hours straight during remote work calls.',
        date: '2026-07-22',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'UltraSlim OLED Smart Watch Series 8',
    brand: 'TechPulse',
    category: 'Electronics',
    price: 299,
    originalPrice: 349,
    discount: 14,
    description: 'Track continuous heart rate, SpO2, sleep stages, GPS workouts, and receive smartphone notifications on a brilliant crisp OLED touch display.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Space Gray', 'Rose Gold', 'Silver'],
    sizes: ['40mm', '44mm'],
    stock: 12,
    rating: 4.7,
    numReviews: 89,
    isFlashSale: true,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Vintage Oversized Denim Jacket',
    brand: 'UrbanThread',
    category: 'Fashion',
    price: 65,
    originalPrice: 85,
    discount: 23,
    description: '100% premium cotton denim jacket styled with a relaxed drop-shoulder cut, washed vintage tone, and durable metal hardware buttons.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Washed Blue', 'Dark Charcoal', 'Vintage White'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35,
    rating: 4.6,
    numReviews: 64,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Aerodynamic Lightweight Running Shoes',
    brand: 'StrideFit',
    category: 'Sports',
    price: 110,
    originalPrice: 140,
    discount: 21,
    description: 'Engineered breathable mesh upper with responsive carbon-infused foam cushioning for maximum energy return and joint support.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Crimson Red', 'Neon Lime', 'Stealth Black'],
    sizes: ['8', '9', '10', '11', '12'],
    stock: 18,
    rating: 4.9,
    numReviews: 210,
    isFlashSale: true,
    isBestSeller: true,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Organic Artisanal Cold Brew Coffee Beans (1kg)',
    brand: 'ValleyRoast',
    category: 'Grocery',
    price: 24,
    originalPrice: 30,
    discount: 20,
    description: '100% Arabica shade-grown single-origin coffee beans roasted locally in small batches. Deep notes of dark chocolate, toasted hazelnut, and caramel.',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 95,
    isNewArrival: true,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Hydrating Botanical Hyaluronic Acid Facial Serum',
    brand: 'Lumiere Skincare',
    category: 'Beauty',
    price: 38,
    originalPrice: 48,
    discount: 20,
    description: 'Formulated with triple molecular hyaluronic acid, niacinamide, and organic botanical extracts to intensely plump, brighten, and nourish dry skin.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597261-8131e1707193?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 42,
    rating: 4.7,
    numReviews: 118,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Digital Touch Smart Digital Air Fryer XL (5.8L)',
    brand: 'ChefCraft',
    category: 'Home & Kitchen',
    price: 129,
    originalPrice: 169,
    discount: 23,
    description: 'Rapid 360-degree air circulation cooks food with 85% less oil. Includes 10 pre-set cooking modes, non-stick dishwasher safe basket, and digital LED display.',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Matte Black', 'Stainless Steel'],
    stock: 15,
    rating: 4.9,
    numReviews: 175,
    isFlashSale: true,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'The Modern Full-Stack Developer Guide (2026 Edition)',
    brand: 'TechPress Publishing',
    category: 'Books',
    price: 35,
    originalPrice: 45,
    discount: 22,
    description: 'Master modern TypeScript, React 19, Node.js server architectures, Cloud databases, and AI integration with real-world enterprise coding patterns.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    rating: 4.9,
    numReviews: 88,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Ergonomic Breathable Mesh Executive Office Chair',
    brand: 'ErgoMax',
    category: 'Home & Kitchen',
    price: 219,
    originalPrice: 280,
    discount: 21,
    description: 'Dynamic lumbar support, 3D adjustable armrests, recline lock, and breathable mesh back designed for 10+ hours of comfortable posture support.',
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Charcoal Black', 'Slate Gray'],
    stock: 8,
    rating: 4.6,
    numReviews: 53,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'Non-Slip Eco Alignment Yoga Mat (6mm)',
    brand: 'ZenFlow',
    category: 'Sports',
    price: 45,
    originalPrice: 60,
    discount: 25,
    description: 'Biodegradable natural tree rubber with laser-etched alignment guides, ultra-grip texture for hot yoga, and extra joint cushioning.',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Sage Green', 'Dusty Lavender', 'Ocean Teal'],
    stock: 22,
    rating: 4.8,
    numReviews: 76,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: 'High-Precision RGB Mechanical Gaming Keyboard',
    brand: 'TechPulse',
    category: 'Electronics',
    price: 119,
    originalPrice: 149,
    discount: 20,
    description: 'Custom hot-swappable tactile switches, per-key RGB backlighting, durable PBT keycaps, and aluminum top plate construction.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Matte Black', 'Arctic White'],
    stock: 25,
    rating: 4.8,
    numReviews: 112,
    isNewArrival: true,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'StudioPro Portable Waterproof Bluetooth Speaker',
    brand: 'AuraSound',
    category: 'Electronics',
    price: 89,
    originalPrice: 119,
    discount: 25,
    description: 'Deep 360-degree punchy bass, IPX7 waterproof construction, 24-hour battery playtime, and built-in speakerphone for hands-free calls.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Midnight Black', 'Forest Green', 'Coral Red'],
    stock: 30,
    rating: 4.7,
    numReviews: 94,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-13',
    name: 'Multi-Port USB-C GaN 100W Fast Charger & Power Bank',
    brand: 'TechPulse',
    category: 'Electronics',
    price: 69,
    originalPrice: 89,
    discount: 22,
    description: 'Compact 100W GaN fast charger with 4 ports (3 USB-C, 1 USB-A) capable of fast charging laptops, tablets, and phones simultaneously.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 4.9,
    numReviews: 160,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-14',
    name: 'Premium Linen-Blend Casual Button-Down Shirt',
    brand: 'UrbanThread',
    category: 'Fashion',
    price: 49,
    originalPrice: 65,
    discount: 24,
    description: 'Breathable, lightweight 55% linen and 45% organic cotton blend crafted for effortless resort style and summer comfort.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Sand Beige', 'Sky Blue', 'Olive Green', 'Classic White'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
    rating: 4.6,
    numReviews: 52,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-15',
    name: 'Handcrafted Vintage Leather Messenger Bag',
    brand: 'UrbanThread',
    category: 'Fashion',
    price: 135,
    originalPrice: 175,
    discount: 22,
    description: 'Full-grain genuine leather satchel bag featuring padded 15.6" laptop sleeve, brass magnetic closures, and adjustable shoulder strap.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Cognac Brown', 'Dark Espresso'],
    stock: 14,
    rating: 4.8,
    numReviews: 78,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-16',
    name: 'Classic Polarized Retro Sunglasses',
    brand: 'AuraStyle',
    category: 'Fashion',
    price: 39,
    originalPrice: 55,
    discount: 29,
    description: 'UV400 polarized anti-glare lenses encased in a lightweight, scratch-resistant acetate frame with reinforced stainless steel hinges.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Tortoiseshell', 'Matte Black', 'Gold Frame'],
    stock: 60,
    rating: 4.7,
    numReviews: 120,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-17',
    name: 'Cold-Pressed Extra Virgin Tuscan Olive Oil (750ml)',
    brand: 'ValleyRoast',
    category: 'Grocery',
    price: 28,
    originalPrice: 35,
    discount: 20,
    description: 'First cold-pressed single estate extra virgin olive oil imported directly from Tuscany. Robust herbaceous flavor with a pepper finish.',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.9,
    numReviews: 67,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-18',
    name: 'Organic Ceremonial Grade Japanese Matcha Powder',
    brand: 'ZenFlow',
    category: 'Grocery',
    price: 32,
    originalPrice: 42,
    discount: 23,
    description: '100% shade-grown first harvest Uji matcha green tea powder. Vibrant green color, rich in L-theanine antioxidants with a sweet umami finish.',
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 28,
    rating: 4.8,
    numReviews: 83,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-19',
    name: 'Raw Artisan Wildflower Honey Jars (Set of 2)',
    brand: 'PureBee',
    category: 'Grocery',
    price: 22,
    originalPrice: 28,
    discount: 21,
    description: 'Unfiltered, unpasteurized pure honey harvested from wildflower apiaries. Packed with natural pollen, enzymes, and delicate floral aroma.',
    images: [
      'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 55,
    rating: 4.9,
    numReviews: 140,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-20',
    name: 'Pure Cold-Pressed Organic Rosehip Seed Oil',
    brand: 'Lumiere Skincare',
    category: 'Beauty',
    price: 26,
    originalPrice: 34,
    discount: 23,
    description: 'Unrefined 100% pure organic rosehip oil packed with Essential Fatty Acids and Vitamin A to soothe scars, fine lines, and uneven tone.',
    images: [
      'https://images.unsplash.com/photo-1608248597261-8131e1707193?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    rating: 4.8,
    numReviews: 91,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-21',
    name: 'Velvet Matte Longwear Liquid Lipstick Collection',
    brand: 'Lumiere Beauty',
    category: 'Beauty',
    price: 29,
    originalPrice: 40,
    discount: 27,
    description: 'Transfer-proof 16-hour longwear matte liquid lipstick set infused with hydrating vitamin E and jojoba oil for soft comfort.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Ruby Red', 'Nude Blossom', 'Berry Plum'],
    stock: 25,
    rating: 4.7,
    numReviews: 105,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-22',
    name: 'Ionic Fast-Dry Hair Blow Dryer & Sculpting Tool',
    brand: 'AuraStyle',
    category: 'Beauty',
    price: 89,
    originalPrice: 119,
    discount: 25,
    description: 'High-speed brushless motor with negative ion generator locks in moisture, eliminates frizz, and reduces drying time by 50%.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Rose Pink', 'Pearl White', 'Matte Black'],
    stock: 20,
    rating: 4.8,
    numReviews: 68,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-23',
    name: 'Heavy-Duty Adjustable Rubber Hex Dumbbells Set',
    brand: 'StrideFit',
    category: 'Sports',
    price: 149,
    originalPrice: 189,
    discount: 21,
    description: 'Solid cast-iron core encapsulated in low-odor rubber, anti-roll hex geometry, and contoured chrome knurled handles.',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['10 lb Pair', '20 lb Pair', '30 lb Pair'],
    stock: 16,
    rating: 4.9,
    numReviews: 88,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-24',
    name: 'Vacuum Insulated Stainless Steel Hydration Flask (1L)',
    brand: 'HydroPeak',
    category: 'Sports',
    price: 29,
    originalPrice: 38,
    discount: 23,
    description: 'Double-wall thermal insulation keeps drinks ice cold for 24 hours or piping hot for 12 hours. Sweat-free powder-coated finish with leakproof straw lid.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Pacific Blue', 'Matte Black', 'Blush Pink', 'Alpine White'],
    stock: 48,
    rating: 4.8,
    numReviews: 135,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-25',
    name: 'High-Waist Athletic Workout Compression Tights',
    brand: 'StrideFit',
    category: 'Sports',
    price: 48,
    originalPrice: 62,
    discount: 22,
    description: 'Four-way stretch squat-proof fabric with tummy control high waistband and deep side pockets for large phones.',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Midnight Navy', 'Charcoal', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 35,
    rating: 4.7,
    numReviews: 92,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-26',
    name: 'Commercial Grade Espresso & Cappuccino Maker',
    brand: 'ChefCraft',
    category: 'Home & Kitchen',
    price: 249,
    originalPrice: 310,
    discount: 20,
    description: '15-bar Italian pressure pump with commercial steam wand for silky microfoam latte art. PID temperature control guarantees optimal extraction.',
    images: [
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Stainless Steel', 'Matte Black'],
    stock: 10,
    rating: 4.9,
    numReviews: 110,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-27',
    name: 'Japanese 67-Layer Damascus Steel Chef Knife Set',
    brand: 'ChefCraft',
    category: 'Home & Kitchen',
    price: 159,
    originalPrice: 200,
    discount: 20,
    description: 'Razor-sharp VG-10 Japanese Damascus steel core hardened to 60+ HRC, ergonomic Pakkawood ergonomic handle, and magnetic block holder.',
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    rating: 4.9,
    numReviews: 74,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-28',
    name: 'Minimalist LED Smart Ambient Standing Floor Lamp',
    brand: 'Lumiere Home',
    category: 'Home & Kitchen',
    price: 85,
    originalPrice: 110,
    discount: 22,
    description: '16 million customizable colors, music sync modes, smartphone app control, and Alexa/Google Home voice assistant integration.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Satin Black', 'Silver Alloy'],
    stock: 22,
    rating: 4.7,
    numReviews: 61,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-29',
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    brand: 'Mindset Books',
    category: 'Books',
    price: 21,
    originalPrice: 28,
    discount: 25,
    description: 'The #1 New York Times bestseller revealing practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 75,
    rating: 5.0,
    numReviews: 320,
    isBestSeller: true,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-30',
    name: 'Designing Data-Intensive Applications (2nd Edition)',
    brand: 'TechPress Publishing',
    category: 'Books',
    price: 42,
    originalPrice: 55,
    discount: 23,
    description: 'An indispensable guide to the principles and architecture behind modern distributed systems, data storage, batch processing, and streaming engines.',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    rating: 4.9,
    numReviews: 145,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-31',
    name: 'Plant-Based Mediterranean Cookbook & Meal Planner',
    brand: 'ChefCraft Press',
    category: 'Books',
    price: 26,
    originalPrice: 34,
    discount: 23,
    description: 'Over 120 delicious heart-healthy plant-based recipes with full-color photography, nutritional macros, and 4-week structured meal plans.',
    images: [
      'https://images.unsplash.com/photo-1495440153380-626154561081?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 62,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-32',
    name: 'Ultra HD 4K Noise-Canceling Vlog Camera with Ring Light',
    brand: 'TechPulse',
    category: 'Electronics',
    price: 349,
    originalPrice: 429,
    discount: 18,
    description: '4K 60fps ultra-clear video sensor, built-in dual directional microphone, 3-level warm LED ring light, and flip-out LCD touchscreen for creators.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Obsidian Black', 'Metallic Silver'],
    stock: 18,
    rating: 4.9,
    numReviews: 124,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-33',
    name: 'Magnetic Fast Wireless Charging Dock Station 3-in-1',
    brand: 'TechPulse',
    category: 'Electronics',
    price: 54,
    originalPrice: 75,
    discount: 28,
    description: 'Simultaneously fast-charge phone, smartwatch, and wireless earbuds with MagSafe magnetic alignment and intelligent safety temp control.',
    images: [
      'https://images.unsplash.com/photo-1622445268465-8428865d21a3?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Space Gray', 'Pure White'],
    stock: 40,
    rating: 4.7,
    numReviews: 86,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-34',
    name: 'Water-Resistant All-Weather Windbreaker Anorak Jacket',
    brand: 'UrbanThread',
    category: 'Fashion',
    price: 79,
    originalPrice: 99,
    discount: 20,
    description: 'Lightweight packable shell constructed from recycled ripstop nylon with DWR water-repellent coating and adjustable bungee hood.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Pine Green', 'Navy Blue', 'Mustard Yellow'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 32,
    rating: 4.8,
    numReviews: 58,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-35',
    name: 'Handcrafted Genuine Italian Suede Slip-On Loafers',
    brand: 'UrbanThread',
    category: 'Fashion',
    price: 115,
    originalPrice: 150,
    discount: 23,
    description: 'Supple Italian suede leather with cushioned memory foam footbed and non-slip rubber traction sole for refined daily comfort.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Tobacco Brown', 'Charcoal Suede', 'Navy Blue'],
    sizes: ['8', '9', '10', '11', '12'],
    stock: 20,
    rating: 4.9,
    numReviews: 47,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-36',
    name: 'Organic Raw Unfiltered Apple Cider Vinegar with Mother (1L)',
    brand: 'PureBee',
    category: 'Grocery',
    price: 16,
    originalPrice: 22,
    discount: 27,
    description: 'Naturally fermented from 100% organic Washington apples. Contains live friendly bacteria cultures and beneficial enzymes.',
    images: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 65,
    rating: 4.9,
    numReviews: 180,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-37',
    name: 'Artisanal Himalayan Pink Salt & Cracked Pepper Grinders',
    brand: 'ValleyRoast',
    category: 'Grocery',
    price: 19,
    originalPrice: 25,
    discount: 24,
    description: 'Refillable brushed stainless steel coarse salt and organic Tellicherry peppercorn grinder set with adjustable ceramic rotor.',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 4.8,
    numReviews: 92,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-38',
    name: 'Hydrating Antioxidant Vitamin C Glowing Night Cream',
    brand: 'Lumiere Skincare',
    category: 'Beauty',
    price: 44,
    originalPrice: 58,
    discount: 24,
    description: 'Rich overnight recovery balm packed with 15% stabilised Vitamin C, Ferulic Acid, and Squalane to restore radiance overnight.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 34,
    rating: 4.8,
    numReviews: 104,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-39',
    name: 'Pro Ceramic Hair Straightening & Styling Brush',
    brand: 'AuraStyle',
    category: 'Beauty',
    price: 68,
    originalPrice: 89,
    discount: 23,
    description: 'Anti-scald ceramic heated bristles with ionic frizz control and digital temperature display up to 450°F in 30 seconds.',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Blush Pink', 'Matte Black'],
    stock: 26,
    rating: 4.7,
    numReviews: 81,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-40',
    name: 'Pro-Grade Speed Jump Rope with Ball Bearing Handles',
    brand: 'StrideFit',
    category: 'Sports',
    price: 22,
    originalPrice: 30,
    discount: 26,
    description: '360-degree dual ball bearings prevent tangling during double-unders. Adjustable steel wire rope with silicone anti-slip grips.',
    images: [
      'https://images.unsplash.com/photo-1598136490937-f77b0ce520fe?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Neon Red', 'Stealth Gray', 'Electric Blue'],
    stock: 55,
    rating: 4.9,
    numReviews: 130,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-41',
    name: 'Waterproof Lightweight Outdoor Hiking Backpack (30L)',
    brand: 'HydroPeak',
    category: 'Sports',
    price: 65,
    originalPrice: 85,
    discount: 23,
    description: 'Ergonomic airflow back panel, built-in hydration bladder port, rain cover pouch, and reinforced trekking pole attachments.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Olive Camo', 'Ocean Blue', 'Charcoal Gray'],
    stock: 24,
    rating: 4.8,
    numReviews: 71,
    isFlashSale: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-42',
    name: 'Smart Temperature Control Stainless Steel Thermal Mug',
    brand: 'ChefCraft',
    category: 'Home & Kitchen',
    price: 59,
    originalPrice: 79,
    discount: 25,
    description: 'Maintains exact drinking temperature for 6+ hours with LED touch indicator ring and leakproof magnetic slider lid.',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Matte Black', 'Sage Green', 'Rose Gold'],
    stock: 38,
    rating: 4.9,
    numReviews: 112,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-43',
    name: 'Pre-Seasoned Non-Stick Cast Iron Skillet Set (3-Piece)',
    brand: 'ChefCraft',
    category: 'Home & Kitchen',
    price: 74,
    originalPrice: 98,
    discount: 24,
    description: 'Heavy-duty 8", 10", and 12" cast iron pans pre-seasoned with 100% natural vegetable oil for superior heat retention.',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    rating: 4.9,
    numReviews: 156,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-44',
    name: 'System Design Interview – An Insider’s Guide (Vol 2)',
    brand: 'TechPress Publishing',
    category: 'Books',
    price: 38,
    originalPrice: 49,
    discount: 22,
    description: 'Comprehensive step-by-step solutions to 13 real-world system design questions including distributed payment systems, S3 storage, and real-time chat.',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 5.0,
    numReviews: 210,
    isBestSeller: true,
    isRecommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-45',
    name: 'The Psychology of Money: Timeless Lessons on Wealth',
    brand: 'Mindset Books',
    category: 'Books',
    price: 22,
    originalPrice: 28,
    discount: 21,
    description: 'Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of life’s most important topic.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 80,
    rating: 4.9,
    numReviews: 380,
    isRecommended: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    description: '10% discount on your entire order',
  },
  {
    code: 'SUPER20',
    discountPercent: 20,
    maxDiscount: 100,
    minOrderValue: 50,
    description: '20% off on orders above $50 (Max $100 off)',
  },
  {
    code: 'FREESHIP',
    discountPercent: 100,
    description: '100% Free Shipping on your order',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Store Administrator',
    email: 'admin@ecommerce.com',
    phone: '+1 (555) 019-2831',
    role: 'admin',
    createdAt: '2026-01-15T10:00:00.000Z',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Store Head Office',
        phone: '+1 (555) 019-2831',
        street: '750 Commerce Boulevard, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94103',
        type: 'work',
        isDefault: true,
      }
    ]
  },
  {
    id: 'user-demo',
    name: 'Brindha Customer',
    email: 'customer@ecommerce.com',
    phone: '+1 (555) 321-7890',
    role: 'customer',
    createdAt: '2026-03-10T14:20:00.000Z',
    addresses: [
      {
        id: 'addr-2',
        fullName: 'Brindha Customer',
        phone: '+1 (555) 321-7890',
        street: '42 Blossom Way, Apt 3B',
        city: 'Austin',
        state: 'TX',
        pincode: '78701',
        type: 'home',
        isDefault: true,
      }
    ]
  }
];
