const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserSLA() {
  const sla = await prisma.sLADefinition.findUnique({
    where: {
      id: 'cm491mfs2000nc2ko13h5xoy2'
    },
    include: {
      user: true
    }
  });
  
  if (sla) {
    console.log("Found SLA:", {
      ...sla,
      user: {
        ...sla.user,
        externalId: sla.user.externalId
      }
    });
  } else {
    console.log("SLA not found");
  }
  
  await prisma.$disconnect();
}

checkUserSLA().catch(console.error);
