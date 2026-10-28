import readline from 'readline-sync';

export default class Riddle {
  constructor({ id, name, taskDescription, correctAnswer }) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer.trim().toLowerCase();
  }

  ask() {
    console.log(`\nRiddle ${this.id}: ${this.name}`);
    while (true) {
      const userAnswer = readline.question(`${this.taskDescription} → `).trim().toLowerCase();
      if (userAnswer === this.correctAnswer) {
        console.log('Correct!');
        break;
      } else {
        console.log('Incorrect. Try again!');
      }
    }
  }
}