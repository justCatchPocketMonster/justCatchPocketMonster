import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "../src/core/schemas/User";
import allPokemon from "../src/data/pokemon.json";
import { random } from "../src/utils/helperFunction";

config();

async function giveRandomPokemon() {
  if (process.env.ENVIRONMENT !== "dev") {
    console.error("This script can only run in dev environment. Set ENVIRONMENT=dev in .env");
    process.exit(1);
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Connected to MongoDB");

    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users`);

    const validPokemon = allPokemon.filter((p) => p.id !== 0);
    let updatedCount = 0;

    for (const user of users) {
      const savePokemon = user.savePokemon?.data || {};
      
      if (!savePokemon || Object.keys(savePokemon).length === 0) {
        console.log(`Skipping user ${user.discordId} - no pokemon initialized`);
        continue;
      }

      let pokemonAdded = 0;

      for (const pokemon of validPokemon) {
        const pokemonKey = `${pokemon.id}-${pokemon.form}-${pokemon.versionForm}`;

        const normalCount = random(11);
        const shinyCount = random(normalCount + 1);

        if (normalCount === 0 && shinyCount === 0) {
          continue;
        }

        const currentPokemon = savePokemon[pokemonKey];
        const newNormalCount = (currentPokemon?.normalCount || 0) + normalCount;
        const newShinyCount = (currentPokemon?.shinyCount || 0) + shinyCount;

        savePokemon[pokemonKey] = {
          idPokemon: pokemon.id.toString(),
          rarity: pokemon.rarity,
          form: pokemon.form,
          versionForm: pokemon.versionForm,
          normalCount: newNormalCount,
          shinyCount: newShinyCount,
        };

        pokemonAdded++;
      }

      await User.updateOne(
        { discordId: user.discordId },
        { $set: { "savePokemon.data": savePokemon } }
      );

      updatedCount++;
      console.log(`Updated user ${user.discordId}: Added ${pokemonAdded} pokemon entries`);
    }

    console.log(`\nCompleted! Updated ${updatedCount} users`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

giveRandomPokemon();
