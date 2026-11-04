export default class Player {
    // מכיל id, name, lowestTime במקום times[]
    // כי עכשיו אנחנו שומרים רק את הזמן הכולל הטוב ביותר של השחקן בקובץ
    constructor(id, name, lowestTime = null) {
        this.id = id;
        this.name = name;
        this.lowestTime = lowestTime;
        this.times = []; // זמני המשחק הנוכחי בלבד (לא נשמר ב-DB)
    }

    getTotalTime() {
        return this.times.reduce((acc, curr) => acc + curr, 0);
    }

    showStats(isFinal = true) {
        const totalTime = this.getTotalTime();
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
