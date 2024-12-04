import { db } from "../src/db";

async function checkSLAs() {
  const slas = await db.sLADefinition.findMany({
    include: {
      EventCategory: true,
      user: true
    }
  });

  console.log("Found SLAs:", slas.length);
  console.log(JSON.stringify(slas, null, 2));
}

checkSLAs()
  .catch(console.error)
  .finally(() => process.exit());
