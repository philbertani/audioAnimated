"use strict";

const {
  db,
  models: { User, Project, Section, File, user_projects },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  await User.create({ username: "robert", password: "123" });
  await User.create({ username: "philip", password: "123" });
  await User.create({ username: "chris", password: "123" });

  await Project.create({ name: "project1", sectionDuration: 37 });
  await Project.create({ name: "project2" });

  await Section.create({ projectId: 1, sectionNumber: 1 });
  await Section.create({ projectId: 1, sectionNumber: 2 });
  await Section.create({ projectId: 1, sectionNumber: 3 });
  await Section.create({ projectId: 2, sectionNumber: 1 });
  await Section.create({ projectId: 2, sectionNumber: 2 });

  const files = await Promise.all([
    File.create({
      name: "rhythm1",
      filePath: "seed_rhythm_AMaj_1_4_mystery_60bpm_8bars.mp3",
      type: "mp3",
      sectionId: 1,
      userId: 1,
    }),
    File.create({
      name: "rhythm1",
      filePath: "seed_rhythm_AMaj_1_4_mystery_60bpm_8bars.mp3",
      type: "mp3",
      sectionId: 2,
      userId: 1,
    }),
    File.create({
      name: "bass1",
      filePath: "seed_bass_AMaj_1_4_mystery_60bpm_8bars.mp3",
      type: "mp3",
      sectionId: 2,
      userId: 1,
    }),
    File.create({
      name: "rhythm1",
      filePath: "seed_rhythm_AMaj_1_4_mystery_60bpm_8bars.mp3",
      type: "mp3",
      sectionId: 3,
      userId: 1,
    }),
    File.create({
      name: "bass1",
      filePath: "seed_bass_AMaj_1_4_mystery_60bpm_8bars.mp3",
      type: "mp3",
      sectionId: 3,
      userId: 1,
    }),
    File.create({
      name: "lead1",
      filePath: "seed_lead1_AMaj_1_4_mystery_60bpm_8bars.mp3",
      type: "mp3",
      sectionId: 3,
      userId: 1,
    }),
  ]);

  console.log("seeded database");

  console.log(`seeded successfully`);
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
    await user_projects.create({ userId: 1, projectId: 1 });
    await user_projects.create({ userId: 1, projectId: 2 });
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
