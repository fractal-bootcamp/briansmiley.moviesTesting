import { Trainer } from "@prisma/client";
import prisma from "./client";
import { faker } from "@faker-js/faker";

async function createTrainersandFetchPokemon() {
  const trainers: Trainer[] = [];
  // Create 10 trainers
  for (let i = 0; i < 10; i++) {
    const trainerName = faker.person.firstName();
    const trainer = await prisma.trainer.create({
      data: {
        name: trainerName
      }
    });
    trainers.push(trainer);
    console.log(`Created trainer: ${trainer.name} with id: ${trainer.id}`);
  }
  // Fetch Pokémon data from the API
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
  const data = await response.json();
  for (const pokemon of data.results) {
    const pokemonResponse = await fetch(pokemon.url);
    console.log(pokemonResponse);
    const pokemonData = await pokemonResponse.json();
    console.log("pokemonData done");
    const randomTrainer = trainers[Math.floor(Math.random() * trainers.length)];
    // Insert the Pokémon data into the database
    await prisma.pokemon.create({
      data: {
        name: pokemonData.name,
        trainer: {
          connect: {
            id: randomTrainer.id
          }
        }
      }
    });
    console.log(
      `Created Pokémon: ${pokemonData.name} for trainer: ${randomTrainer.name}`
    );
  }
  console.log("Database has been seeded with Pokémon");
}
createTrainersandFetchPokemon()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
