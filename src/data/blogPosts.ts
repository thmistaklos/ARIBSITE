interface BlogPost {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  content: string;
}

export const ALL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Amazing Benefits of Dairy',
    image: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare%20(1).com_wallpaper',
    shortDescription: 'Discover how dairy products contribute to a healthy lifestyle, from strong bones to improved immunity.',
    content: 'Dairy products are packed with essential nutrients like calcium, vitamin D, and protein, which are crucial for bone health. Regular consumption can also support muscle growth and overall well-being. Beyond calcium, milk, yogurt, and cheese offer a range of vitamins and minerals that play vital roles in various bodily functions, including nerve function and energy production. Incorporating dairy into your diet can be a delicious way to boost your nutrient intake.',
  },
  {
    id: '2',
    title: 'Behind the Scenes: Our Sustainable Farming',
    image: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare%20(2).com_wallpaper',
    shortDescription: 'Learn about ARIB DAIRY\'s commitment to sustainable farming practices and animal welfare.',
    content: 'At ARIB DAIRY, sustainability is at the core of everything we do. We employ eco-friendly farming techniques, minimize waste, and prioritize the well-being of our cows. Our farms utilize renewable energy sources and efficient water management systems to reduce our environmental footprint. We believe that healthy cows and a healthy planet lead to the best quality dairy products. Our commitment extends to ensuring our animals are treated with the utmost care and respect, providing them with comfortable living conditions and nutritious diets.',
  },
  {
    id: '3',
    title: 'Delicious Dairy-Free Alternatives (and why ours are better!)',
    image: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(1).jpg',
    shortDescription: 'Exploring the world of dairy-free options and why traditional dairy remains a superior choice for many.',
    content: 'While dairy-free alternatives have gained popularity, traditional dairy products offer a unique nutritional profile and taste that is hard to replicate. Our dairy products are naturally rich in calcium, protein, and vitamins, providing a wholesome and complete food source. We believe in the natural goodness of milk and its derivatives, offering unparalleled flavor and texture for cooking and consumption. For those who can enjoy dairy, it remains an excellent source of essential nutrients.',
  },
  {
    id: '4',
    title: 'The Journey of Milk: From Farm to Bottle',
    image: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper%20(2).jpg',
    shortDescription: 'Follow the meticulous process that ensures our milk is fresh, safe, and delicious when it reaches you.',
    content: 'The journey of ARIB DAIRY milk begins on our lush green pastures, where our cows graze freely. After milking, the milk is quickly transported to our state-of-the-art processing facility. Here, it undergoes rigorous quality checks, pasteurization, and homogenization to ensure its safety and creamy texture. Finally, it\'s bottled and delivered fresh to your local stores, maintaining its natural goodness every step of the way. Our commitment to hygiene and quality control ensures that every bottle meets the highest standards.',
  },
  {
    id: '5',
    title: 'Seasonal Dairy Delights',
    image: 'https://goykvqomwqwqklyizeed.supabase.co/storage/v1/object/public/logosandstuff//wallpaperflare.com_wallpaper.jpg',
    shortDescription: 'Discover unique dairy products and recipes that are perfect for each season of the year.',
    content: 'Embrace the changing seasons with our special dairy delights! In spring, enjoy light and fresh yogurt parfaits with seasonal berries. Summer calls for refreshing homemade ice creams and chilled milkshakes. As autumn arrives, warm up with creamy pumpkin spice lattes made with our rich milk. Winter is perfect for indulging in hearty cheese fondues and comforting hot chocolates. Each season brings new opportunities to enjoy the versatility of dairy.',
  },
];