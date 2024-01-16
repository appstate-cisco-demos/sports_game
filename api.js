const express = require('express');
const app = express();
const PORT = 3000;

let data = {
    score: {
        home: {
            name: 'Home team',
            points: 0,
        },
        away: {
            name: 'Away team',
            points: 0
        }
    },
    time: '15:00',
    quarter: 1
};

app.get('/api', (req, res) => {
    res.send(data);
})

const teams = {
  home: {
    name: 'Home Team',
    score: 0,
  },
  away: {
    name: 'Away Team',
    score: 0,
  },
};

const probabilities = {
  twoPointer: 0.25,  // Probability of making a 2-pointer
  threePointer: 0.15,  // Probability of making a 3-pointer during a possession
  foul: 0.1,  // Probability of a regular foul
  shootingFoul: 0.05,  // Probability of a shooting foul
  threeFreeThrows: 0.02,  // Probability of getting 3 free throws
};

let gameTime = 12 * 60; // 12 minutes in seconds
let quarter = 1;
let timeShotTaken = 0;

function simulateGame() {
  if (quarter > 4) {
    console.log('Game over!');
    return;
  }

  if (gameTime <= 0) {
    // Quarter break
    gameTime = 12 * 60; // Reset game time to 12 minutes
    console.log(`End of Quarter ${quarter}`);
    quarter++;
  }

  // Simulate a team possession
  const team = Math.random() < 0.5 ? 'home' : 'away';

  // Update the game clock
  if (timeShotTaken === 0) {
    const timeInterval = Math.floor(Math.random() * 21) + 4; // Random time between 4 and 24 seconds
    timeShotTaken = gameTime - timeInterval;
  }
  
  // Calculate the outcome of a possession
  if (timeShotTaken === gameTime) {
    const possessionOutcome = Math.random();
    if (possessionOutcome < probabilities.twoPointer) {
        teams[team].score += 2;
        console.log(`${teams[team].name} made a 2-pointer during the possession!`);
    } else if (possessionOutcome < probabilities.twoPointer + probabilities.threePointer) {
        teams[team].score += 3;
        console.log(`${teams[team].name} made a 3-pointer during the possession!`);
    } else {
        console.log(`${teams[team].name} missed the shot during the possession.`);
    }
    // Simulate fouls
    if (Math.random() < probabilities.foul) {
        console.log('Foul called.');
    }

    // Simulate shooting fouls
    if (Math.random() < probabilities.shootingFoul) {
        console.log('Shooting foul called.');
        if (Math.random() < probabilities.threeFreeThrows) {
            console.log('Shooting team gets 3 free throws.');
        } else {
            console.log('Shooting team gets 2 free throws.');
        }
    }
    timeShotTaken = 0;
  }

  // Update scores and time
  gameTime -= 1;
  console.log(`Score: ${teams.home.name} ${teams.home.score} - ${teams.away.name} ${teams.away.score}`);
  console.log(`Quarter ${quarter}, Game Time: ${Math.floor(gameTime / 60)}:${gameTime % 60 >= 10 ? gameTime % 60 : "0" + gameTime % 60}`);

      data = {
        score: {
          home: {
            name: "Home team",
            points: teams.home.score,
          },
          away: {
            name: "Away team",
            points: teams.away.score,
          },
        },
        time: `${Math.floor(gameTime / 60)}:${
          gameTime % 60 >= 10 ? gameTime % 60 : "0" + (gameTime % 60)
        }`,
        quarter: 1,
      };

  setTimeout(simulateGame, 1000);
}

simulateGame();


app.listen(PORT);