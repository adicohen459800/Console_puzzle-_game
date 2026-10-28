import readline from 'readline-sync';
import allRiddlesData from './riddles/index.js';
import Riddle from './classes/Riddle.js';
import Player from './classes/Player.js';

// פונקציית מעטפת (Decorator) למדידת משך הזמן שלוקח לפתור חידה
function measureTime(riddleInstance, player) {
  const startTime = Date.now();
  riddleInstance.ask(); // מציג את החידה ומחכה לתשובה הנכונה
  const endTime = Date.now();

  player.recordTime(startTime, endTime);
}

function startGame() {
  console.log("Welcome to the Riddle Game!");

  // 1. בקשת שם השחקן
  const playerName = readline.question('What is your name? ');
  const player = new Player(playerName);

  // 2. טעינת כל החידות והמרתן למופעים של מחלקת Riddle (יוצרים עותק כתור חידות)
  const riddlesQueue = allRiddlesData.map(data => new Riddle(data));

  let playing = true;

  while (playing) {
    // בדיקה אם נשארו חידות במאגר
    if (riddlesQueue.length === 0) {
      console.log("\nכל החידות נפתרו בהצלחה!");
      player.showStats(true);
      break;
    }

    // תפריט בחירה לשחקן
    console.log(`\n--- תפריט ראשי (חידות זמינות: ${riddlesQueue.length}) ---`);
    const options = [
      "קבל חידה נוספת",
      "הצג תוצאות וסטטיסטיקה עד כה",
      "סיים את המשחק"
    ];

    const choice = readline.keyInSelect(options, "מה תרצי לעשות?");

    if (choice === 0) {
      // בחירה 1: קבל חידה נוספת (שולפים את החידה הבאה מהתור)
      const currentRiddle = riddlesQueue.shift();
      measureTime(currentRiddle, player);

    } else if (choice === 1) {
      // בחירה 2: הצג תוצאות ביניים עד כה
      if (player.times.length === 0) {
        console.log("\nעדיין לא פתרת אף חידה, אין בינתיים נתונים להציג.");
      } else {
        player.showStats(false);
      }

    } else {
      // בחירה 2 (או יציאה באמצעות Esc): סיים את המשחק
      console.log("\nמסיים את המשחק...");
      if (player.times.length > 0) {
        player.showStats(true);
      } else {
        console.log(`להתראות, ${player.name}! חבל שלא הספקת לפתור חידות.`);
      }
      playing = false;
    }
  }
}

// הפעלת המשחק
startGame();