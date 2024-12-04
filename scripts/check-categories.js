const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  const categories = await prisma.eventCategory.findMany();
  console.log("Found categories:", categories);
  
  await prisma.$disconnect();
}

checkCategories().catch(console.error);
