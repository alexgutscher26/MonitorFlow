const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSLAs() {
  const slas = await prisma.sLADefinition.findMany({
    include: {
      EventCategory: true,
      user: true
    }
  });
  console.log("Found SLAs:", slas);
  
  await prisma.$disconnect();
}

checkSLAs().catch(console.error);
