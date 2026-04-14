const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data.');

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@savoria.com',
      password: 'hashed_password_here', // In a real app, hash this
      role: 'ADMIN',
    },
  });

  // Create Categories
  const starters = await prisma.category.create({
    data: { name: 'Starters', slug: 'starters' },
  });
  const mains = await prisma.category.create({
    data: { name: 'Main Courses', slug: 'mains' },
  });
  const desserts = await prisma.category.create({
    data: { name: 'Desserts', slug: 'desserts' },
  });

  // Create Menu Items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls with black truffle and mozzarella.',
        price: 14.0,
        image: 'https://picsum.photos/seed/arancini/800/600',
        tags: ['vegetarian'],
        categoryId: starters.id,
      },
      {
        name: 'Burrata Salad',
        description: 'Fresh burrata, heirloom tomatoes, basil pesto.',
        price: 16.0,
        image: 'https://picsum.photos/seed/burrata/800/600',
        tags: ['vegetarian', 'gluten-free'],
        categoryId: starters.id,
      },
      {
        name: 'Wagyu Ribeye',
        description: '12oz A5 Wagyu, roasted garlic, rosemary butter.',
        price: 85.0,
        image: 'https://picsum.photos/seed/wagyu/800/600',
        tags: ['gluten-free'],
        categoryId: mains.id,
      },
      {
        name: 'Lobster Linguine',
        description: 'Fresh pasta, half lobster, cherry tomatoes, chili.',
        price: 42.0,
        image: 'https://picsum.photos/seed/lobster/800/600',
        tags: [],
        categoryId: mains.id,
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso and mascarpone.',
        price: 12.0,
        image: 'https://picsum.photos/seed/tiramisu/800/600',
        tags: ['vegetarian'],
        categoryId: desserts.id,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
