
export function getRandomItem<T>(items: T[]): T
export function getRandomItem<T>(items: T[], disallowed: unknown): T | null
export function getRandomItem<T>(items: T[], disallowed?: unknown): T | null {

    if(items.every(item => item === disallowed)){
        return null;
    }

    let randomIndex = Math.floor(items.length * Math.random());

    while(items[randomIndex] === disallowed){
        const indexes = items.map((_, index) => index)
            .filter(index => index != randomIndex);
        
        randomIndex = getRandomItem(indexes);
    }

    return items.splice(randomIndex, 1)[0];
}