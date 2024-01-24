const express = require("express");
const app = express();
const PORT = 3000;

let players = {
  home: [
    {
      name: "Home Player 1",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Home Player 2",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Home Player 3",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Home Player 4",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Home Player 5",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
  ],
  away: [
    {
      name: "Away Player 1",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Away Player 2",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Away Player 3",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Away Player 4",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
    {
      name: "Away Player 5",
      points: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      "3pa": 0,
      "3pm": 0,
      fta: 0,
      ftm: 0,
    },
  ],
};

let data = {
  home: {
    name: "Home team",
    points: 0,
    players: players.home,
    fouls: 0,
    fgm: 0,
    fga: 0,
    "3pa": 0,
    "3pm": 0,
    fta: 0,
    ftm: 0,
  },
  away: {
    name: "Away team",
    points: 0,
    players: players.away,
    fouls: 0,
    fgm: 0,
    fga: 0,
    "3pa": 0,
    "3pm": 0,
    fta: 0,
    ftm: 0,
  },
  time: "15:00",
  quarter: 1,
};

app.get("/total-game-stats", (req, res) => {
  res.send(data);
});

app.get("/players", (req, res) => {
  res.send(players);
});

app.get("/players/:name", (req, res) => {
  const player = [...players.home, ...players.away].find(
    (player) => player.name === req.params.name
  );
  res.send(player);
});

const probabilities = {
  twoPointer: 0.35, // Probability of making a 2-pointer
  threePointer: 0.25, // Probability of making a 3-pointer during a possession
  foul: 0.1, // Probability of a regular foul
  shootingFoul: 0.05, // Probability of a shooting foul
  threeFreeThrows: 0.02, // Probability of getting 3 free throws
  freeThrow: 0.7, // Probability of making a free throw
};

let gameTime = 12 * 60; // 12 minutes in seconds
let quarter = 1;
let timeShotTaken = 0;

function simulateGame() {
  if (gameTime <= 0) {
    // Quarter break
    gameTime = 12 * 60; // Reset game time to 12 minutes
    console.log(`End of Quarter ${quarter}`);
    if (quarter == 4) {
      console.log("Game over!");
      return;
    }
    quarter++;
    data.quarter = quarter;
  }

  // Simulate a team possession
  const team = Math.random() < 0.5 ? "home" : "away";

  // Update the game clock
  if (timeShotTaken <= 0) {
    const timeInterval = Math.floor(Math.random() * 21) + 4; // Random time between 4 and 24 seconds
    timeShotTaken = gameTime - timeInterval;
  }

  // Calculate the outcome of a possession
  if (timeShotTaken === gameTime) {
    const possessionOutcome = Math.random();
    const player = Math.floor(Math.random() * 5);

    if (possessionOutcome < probabilities.threePointer) {
      players[team][player].points += 3;
      players[team][player]["3pa"] += 1;
      players[team][player]["3pm"] += 1;
      players[team][player]["fga"] += 1;
      players[team][player]["fgm"] += 1;
      data[team]["3pa"] += 1;
      data[team]["3pm"] += 1;
      data[team]["fga"] += 1;
      data[team]["fgm"] += 1;
      data[team].points += 3;
      console.log(`${data[team].name} made a 3-pointer during the possession!`);
    } else if (possessionOutcome < probabilities.twoPointer) {
      players[team][player].points += 2;
      players[team][player]["fga"] += 1;
      players[team][player]["fgm"] += 1;
      data[team]["fga"] += 1;
      data[team]["fgm"] += 1;
      data[team].points += 2;
      console.log(`${data[team].name} made a 2-pointer during the possession!`);
    } else {
      console.log(`${data[team].name} missed the shot during the possession.`);
      const amount = Math.floor(Math.random() * 2) + 2;
      players[team][player]["fga"] += 1;
      data[team]["fga"] += 1;

      if (amount === 3) {
        players[team][player]["3pa"] += 1;
        data[team]["3pa"] += 1;
      }
    }
    // Simulate fouls
    if (Math.random() < probabilities.foul) {
      players[team][Math.floor(Math.random() * 5)].fouls += 1;
      data[team]["fouls"] += 1;
      console.log("Foul called.");
    }

    // Simulate shooting fouls
    if (Math.random() < probabilities.shootingFoul) {
      console.log("Shooting foul called.");
      let shots;
      if (Math.random() < probabilities.threeFreeThrows) {
        console.log("Shooting team gets 3 free throws.");
        shots = 3;
      } else {
        console.log("Shooting team gets 2 free throws.");
        shots = 2;
      }

      // Player attempts a free throw and either makes it or misses it
      for (let i = 0; i < shots; i++) {
        players[team][player].fta += 1;
        data[team]["fta"] += 1;

        if (Math.random() < probabilities.freeThrow) {
          console.log(`${players[team][player].name} made free throw ${i}`);
          data[team]["ftm"] += 1;
          data[team]["points"] += 1;
          players[team][player].ftm += 1;
          players[team][player].points += 1;
        } else {
          console.log(`${players[team][player].name} missed free throw ${i}`);
        }
      }
    }
    timeShotTaken = 0;
  }

  // Update scores and time
  gameTime--;
  let timeString = `${Math.floor(gameTime / 60)}:${
    gameTime % 60 >= 10 ? gameTime % 60 : "0" + (gameTime % 60)
  }`;

  console.log(data);
  console.log(
    `Score: ${data.home.name} ${data.home.points} - ${data.away.name} ${data.away.points}`
  );
  console.log(`Quarter ${quarter}, Game Time: ${timeString}`);

  data.time = timeString;

  setTimeout(simulateGame, 100);
}

simulateGame();

app.listen(PORT);
