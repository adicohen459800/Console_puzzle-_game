import readline from 'readline-sync';

export default class Riddle {
  constructor({ id, name, taskDescription, correctAnswer, difficulty, timeLimit, hint }) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer.trim().toLowerCase();
    this.difficulty = difficulty;
    this.timeLimit = timeLimit || 20;
    this.hint = hint;
  }

  ask() {
    console.log(`\nRiddle ${this.id} (${this.difficulty}): ${this.name}`);
    if (this.hint) {
      console.log(`(Type 'hint' if you need a clue - adds 10s penalty)`);
    }

    const startTime = Date.now();
    let penaltySeconds = 0;

    while (true) {
      const userAnswer = readline.question(`${this.taskDescription} → `).trim().toLowerCase();

      if (userAnswer === 'hint') {
        if (this.hint) {
          console.log(`💡 Hint: ${this.hint}`);
          penaltySeconds += 10; 
          console.log("אין רמז זמין לחידה זו.");
        }
        continue; 
      }
      if (userAnswer === this.correctAnswer) {
        console.log('Correct!');
        break;
      } else {
        console.log('Incorrect. Try again!');
      }
    }

    const endTime = Date.now();
    
    let durationInSeconds = Math.round((endTime - startTime) / 1000);

    // בדיקת חריגה ממגבלת הזמן 
    if (durationInSeconds > this.timeLimit) {
      console.log(` Too slow! 5 seconds penalty applied.`);
      penaltySeconds += 5;
    }

    // הוספת כל הקנסות לזמן הכולל של החידה
    const totalRiddleTime = durationInSeconds + penaltySeconds;
    return totalRiddleTime;
  }
}