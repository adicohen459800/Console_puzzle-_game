import readline from 'readline-sync';
import fs from 'fs';
import Riddle from './classes/Riddle.js';
import Player from './classes/Player.js';

// ─── נתיבי קבצי ה-DB ───────────────────────────────────────────────
const RIDDLES_DB = './riddles/db.txt';
const PLAYERS_DB = './players/players.txt';

// ─── פונקציות עזר לקריאה וכתיבה של קבצי DB ────────────────────────
// קוראים את הקובץ ומפרסרים את ה-JSON לתוך מערך
function readDB(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// כותבים מערך חזרה לקובץ בפורמט JSON מסודר
function writeDB(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}

// ─── פונקציית ערבוב מערך (Fisher-Yates) ────────────────────────────
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ─── CRUD חידות ────────────────────────────────────────────────────

// CREATE — שואל את המשתמש פרטים ומוסיף חידה חדשה ל-DB
function createRiddle() {
    const riddles = readDB(RIDDLES_DB);
    const newId = riddles.length > 0 ? riddles[riddles.length - 1].id + 1 : 1;

    const name = readline.question('Enter riddle name: ');
    const taskDescription = readline.question('Enter description: ');
    const correctAnswer = readline.question('Enter correct answer: ');
    const difficultyOptions = ['easy', 'medium', 'hard'];
    const diffIndex = readline.keyInSelect(difficultyOptions, 'Choose difficulty:');
    if (diffIndex === -1) return;
    const timeLimit = parseInt(readline.question('Enter time limit (seconds): ')) || 20;
    const hint = readline.question('Enter hint (optional, press Enter to skip): ');

    const newRiddle = {
        id: newId,
        name,
        taskDescription,
        correctAnswer,
        difficulty: difficultyOptions[diffIndex],
        timeLimit,
        hint: hint || null
    };

    riddles.push(newRiddle);
    writeDB(RIDDLES_DB, riddles);
    console.log(`\nRiddle "${name}" added successfully with ID ${newId}.`);
}

// READ — מדפיס את כל החידות מה-DB
function readRiddles() {
    const riddles = readDB(RIDDLES_DB);
    if (riddles.length === 0) {
        console.log('\nNo riddles found.');
        return;
    }
    console.log('\n=== All Riddles ===');
    riddles.forEach(r => {
        console.log(`[${r.id}] ${r.name} (${r.difficulty}) — ${r.taskDescription}`);
    });
}

// UPDATE — מוצא חידה לפי ID ומאפשר לשנות את הפרטים שלה
function updateRiddle() {
    const riddles = readDB(RIDDLES_DB);
    readRiddles();
    const id = parseInt(readline.question('\nEnter riddle ID to update: '));
    const index = riddles.findIndex(r => r.id === id);

    if (index === -1) {
        console.log('Riddle not found.');
        return;
    }

    const r = riddles[index];
    console.log(`Updating "${r.name}" — press Enter to keep current value.`);

    const name = readline.question(`Name (${r.name}): `) || r.name;
    const taskDescription = readline.question(`Description (${r.taskDescription}): `) || r.taskDescription;
    const correctAnswer = readline.question(`Answer (${r.correctAnswer}): `) || r.correctAnswer;
    const hint = readline.question(`Hint (${r.hint}): `) || r.hint;

    riddles[index] = { ...r, name, taskDescription, correctAnswer, hint };
    writeDB(RIDDLES_DB, riddles);
    console.log('Riddle updated successfully.');
}

// DELETE — מוצא חידה לפי ID ומוחק אותה מהמערך
function deleteRiddle() {
    const riddles = readDB(RIDDLES_DB);
    readRiddles();
    const id = parseInt(readline.question('\nEnter riddle ID to delete: '));
    const index = riddles.findIndex(r => r.id === id);

    if (index === -1) {
        console.log('Riddle not found.');
        return;
    }

    const deleted = riddles.splice(index, 1);
    writeDB(RIDDLES_DB, riddles);
    console.log(`Riddle "${deleted[0].name}" deleted successfully.`);
}

// ─── ניהול שחקנים ──────────────────────────────────────────────────

// מחפש שחקן לפי שם — אם קיים מחזיר אותו, אם לא יוצר ושומר שחקן חדש
function getOrCreatePlayer(name) {
    const players = readDB(PLAYERS_DB);
    const existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (existing) {
        // שחקן קיים — מציג את הזמן הקודם שלו
        if (existing.lowestTime !== null) {
            console.log(`\nHi ${existing.name}! Your previous lowest time was ${existing.lowestTime} seconds.`);
        } else {
            console.log(`\nWelcome back, ${existing.name}! You have no recorded time yet.`);
        }
        return new Player(existing.id, existing.name, existing.lowestTime);
    } else {
        // שחקן חדש — מוסיפים ל-DB
        const newId = players.length > 0 ? players[players.length - 1].id + 1 : 1;
        const newPlayerData = { id: newId, name, lowestTime: null };
        players.push(newPlayerData);
        writeDB(PLAYERS_DB, players);
        console.log(`\nWelcome, ${name}! Good luck!`);
        return new Player(newId, name, null);
    }
}

// מעדכן את זמן השחקן ב-DB אם הזמן החדש טוב יותר
function updatePlayerTime(player, totalTime) {
    const players = readDB(PLAYERS_DB);
    const index = players.findIndex(p => p.id === player.id);
    if (index === -1) return;

    if (players[index].lowestTime === null || totalTime < players[index].lowestTime) {
        players[index].lowestTime = totalTime;
        writeDB(PLAYERS_DB, players);
        console.log(`New record! Time updated to ${totalTime} seconds.`);
    } else {
        console.log(`Your best time is still ${players[index].lowestTime} seconds. Keep trying!`);
    }
}

// ─── לוח תוצאות ────────────────────────────────────────────────────

// טוען את כל השחקנים, ממיין לפי lowestTime ומדפיס
function showLeaderboard() {
    const players = readDB(PLAYERS_DB);
    const ranked = players
        .filter(p => p.lowestTime !== null)
        .sort((a, b) => a.lowestTime - b.lowestTime);

    if (ranked.length === 0) {
        console.log('\nNo scores yet. Be the first to play!');
        return;
    }

    console.log('\n🏆 Leaderboard:');
    ranked.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} - ${p.lowestTime} seconds`);
    });
}

// ─── משחק ──────────────────────────────────────────────────────────
function startGame() {
    const playerName = readline.question('\nWhat is your name? ');
    const player = getOrCreatePlayer(playerName);

    const difficultyOptions = ['easy', 'medium', 'hard'];
    const diffIndex = readline.keyInSelect(difficultyOptions, 'Choose difficulty:');
    if (diffIndex === -1) return;
    const chosenDifficulty = difficultyOptions[diffIndex];

    const allRiddlesData = readDB(RIDDLES_DB);
    const filteredData = allRiddlesData.filter(r => r.difficulty === chosenDifficulty);

    if (filteredData.length === 0) {
        console.log(`No riddles available for difficulty '${chosenDifficulty}'.`);
        return;
    }

    const riddlesQueue = shuffleArray(filteredData).map(data => new Riddle(data));
    let playing = true;

    while (playing) {
        if (riddlesQueue.length === 0) {
            console.log('\nAll riddles solved!');
            player.showStats(true);
            updatePlayerTime(player, player.getTotalTime());
            break;
        }

        console.log(`\n--- Menu (riddles left: ${riddlesQueue.length}) ---`);
        const options = ['Get next riddle', 'Show stats so far', 'End game'];
        const choice = readline.keyInSelect(options, 'What do you want to do?');

        if (choice === 0) {
            const currentRiddle = riddlesQueue.shift();
            const riddleTime = currentRiddle.ask();
            player.times.push(riddleTime);
        } else if (choice === 1) {
            if (player.times.length === 0) {
                console.log('\nYou have not solved any riddles yet.');
            } else {
                player.showStats(false);
            }
        } else {
            console.log('\nEnding game...');
            if (player.times.length > 0) {
                player.showStats(true);
                updatePlayerTime(player, player.getTotalTime());
            } else {
                console.log(`Goodbye, ${player.name}!`);
            }
            playing = false;
        }
    }
}

// ─── תפריט ראשי ────────────────────────────────────────────────────
function mainMenu() {
    console.log('\nWelcome to the Riddle Game!');
    let running = true;

    while (running) {
        const options = [
            'Play the game',
            'Create a new riddle',
            'Read all riddles',
            'Update an existing riddle',
            'Delete a riddle',
            'View leaderboard'
        ];

        const choice = readline.keyInSelect(options, '\nWhat do you want to do?');

        if (choice === 0) startGame();
        else if (choice === 1) createRiddle();
        else if (choice === 2) readRiddles();
        else if (choice === 3) updateRiddle();
        else if (choice === 4) deleteRiddle();
        else if (choice === 5) showLeaderboard();
        else {
            console.log('Goodbye!');
            running = false;
        }
    }
}

mainMenu();
