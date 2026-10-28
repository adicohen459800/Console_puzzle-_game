// import readline from 'readline-sync';
// import allRiddlesData from './riddles/index.js';
// import Riddle from './classes/Riddle.js';
// import Player from './classes/Player.js';

// // פונקציית מעטפת (Decorator) למדידת משך הזמן שלוקח לפתור חידה
// function measureTime(riddleInstance, player) {
//   const startTime = Date.now();
//   riddleInstance.ask(); // מציג את החידה ומחכה לתשובה הנכונה
//   const endTime = Date.now();

//   player.recordTime(startTime, endTime);
// }

// function startGame() {
//   console.log("Welcome to the Riddle Game!");

//   // 1. בקשת שם השחקן
//   const playerName = readline.question('What is your name? ');
//   const player = new Player(playerName);

//   // 2. טעינת כל החידות והמרתן למופעים של מחלקת Riddle (יוצרים עותק כתור חידות)
//   const riddlesQueue = allRiddlesData.map(data => new Riddle(data));

//   let playing = true;

//   while (playing) {
//     // בדיקה אם נשארו חידות במאגר
//     if (riddlesQueue.length === 0) {
//       console.log("\nכל החידות נפתרו בהצלחה!");
//       player.showStats(true);
//       break;
//     }

//     // תפריט בחירה לשחקן
//     console.log(`\n--- תפריט ראשי (חידות זמינות: ${riddlesQueue.length}) ---`);
//     const options = [
//       "קבל חידה נוספת",
//       "הצג תוצאות וסטטיסטיקה עד כה",
//       "סיים את המשחק"
//     ];

//     const choice = readline.keyInSelect(options, "מה תרצי לעשות?");

//     if (choice === 0) {
//       // בחירה 1: קבל חידה נוספת (שולפים את החידה הבאה מהתור)
//       const currentRiddle = riddlesQueue.shift();
//       measureTime(currentRiddle, player);

//     } else if (choice === 1) {
//       // בחירה 2: הצג תוצאות ביניים עד כה
//       if (player.times.length === 0) {
//         console.log("\nעדיין לא פתרת אף חידה, אין בינתיים נתונים להציג.");
//       } else {
//         player.showStats(false);
//       }

//     } else {
//       // בחירה 2 (או יציאה באמצעות Esc): סיים את המשחק
//       console.log("\nמסיים את המשחק...");
//       if (player.times.length > 0) {
//         player.showStats(true);
//       } else {
//         console.log(`להתראות, ${player.name}! חבל שלא הספקת לפתור חידות.`);
//       }
//       playing = false;
//     }
//   }
// }

// // הפעלת המשחק
// startGame();











import readline from 'readline-sync';
import allRiddlesData from './riddles/index.js';
import Riddle from './classes/Riddle.js';
import Player from './classes/Player.js';

// פונקציית ערבוב מערך (Fisher-Yates Shuffle) עבור הפיצ'ר של סדר אקראי
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  console.log("Welcome to the Riddle Game!");

  // 1. בקשת שם השחקן
  const playerName = readline.question('What is your name? ');
  const player = new Player(playerName);

  // 2. בחירת רמת קושי
  const difficultyOptions = ['easy', 'medium', 'hard'];
  const diffIndex = readline.keyInSelect(difficultyOptions, 'Choose difficulty:');
  
  if (diffIndex === -1) {
    console.log("המשחק בוטל.");
    return;
  }
  const chosenDifficulty = difficultyOptions[diffIndex];

  // 3. סינון החידות לפי רמת הקושי שנבחרה
  const filteredData = allRiddlesData.filter(r => r.difficulty === chosenDifficulty);

  if (filteredData.length === 0) {
    console.log(`אין חידות זמינות ברמת הקושי '${chosenDifficulty}'. יוצא מהמשחק.`);
    return;
  }

  // 4. ערבוב החידות בסדר אקראי (Randomized Order) והמרתן למופעים של Riddle
  const shuffledData = shuffleArray(filteredData);
  const riddlesQueue = shuffledData.map(data => new Riddle(data));

  let playing = true;

  while (playing) {
    if (riddlesQueue.length === 0) {
      console.log("\nכל החידות ברמה זו נפתרו בהצלחה!");
      player.showStats(true);
      break;
    }

    console.log(`\n--- תפריט ראשי (חידות זמינות ברמה: ${riddlesQueue.length}) ---`);
    const options = [
      "קבל חידה נוספת",
      "הצג תוצאות וסטטיסטיקה עד כה",
      "סיים את המשחק"
    ];

    const choice = readline.keyInSelect(options, "מה תרצי לעשות?");

    if (choice === 0) {
      // שליפת חידה מהתור והפעלתה
      const currentRiddle = riddlesQueue.shift();
      const riddleTime = currentRiddle.ask(); // מחזיר את הזמן כולל קנסות
      
      // שמירת הזמן אצל השחקן
      player.times.push(riddleTime);

    } else if (choice === 1) {
      if (player.times.length === 0) {
        console.log("\nעדיין לא פתרת אף חידה.");
      } else {
        player.showStats(false);
      }

    } else {
      console.log("\nמסיים את המשחק...");
      if (player.times.length > 0) {
        player.showStats(true);
      } else {
        console.log(`להתראות, ${player.name}!`);
      }
      playing = false;
    }
  }
}

// הפעלת המשחק
startGame();