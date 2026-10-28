export default class Player {
  constructor(name) {
    this.name = name;
    this.times = []; // מערך לשמירת משך הזמן לכל חידה
  }

  recordTime(start, end) {
    const durationInSeconds = Math.round((end - start) / 1000);
    this.times.push(durationInSeconds);
  }

  showStats() {
    const totalTime = this.times.reduce((acc, curr) => acc + curr, 0);
    const avgTime = Math.round(totalTime / this.times.length);

    console.log(`\nGreat job, ${this.name}!`);
    console.log(`Total time: ${totalTime} seconds`);
    console.log(`Average per riddle: ${avgTime} seconds`);
  }
showStats(isFinal = true) {
    const totalTime = this.times.reduce((acc, curr) => acc + curr, 0);
    const avgTime = Math.round(totalTime / this.times.length);

    if (isFinal) {
      console.log(`\nGreat job, ${this.name}!`);
      console.log(`Total time: ${totalTime} seconds`);
      console.log(`Average per riddle: ${avgTime} seconds`);
    } else {
      console.log(`\n--- תוצאות ביניים עבור ${this.name} ---`);
      console.log(`חידות שנפתרו עד כה: ${this.times.length}`);
      console.log(`זמן מצטבר: ${totalTime} שניות`);
      console.log(`ממוצע לחידה: ${avgTime} שניות`);
      console.log(`-----------------------------------`);
    }
  }

}
