export function getRandomItem<T>(items: T[]): T {
    const randomIndex = Math.floor(items.length * Math.random());
    return items.splice(randomIndex, 1)[0];
}