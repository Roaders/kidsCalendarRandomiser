
export function getRandomItem<T>(items: T[]): T
export function getRandomItem<T>(items: T[], disallowedItems: unknown[] | unknown): T | null
export function getRandomItem<T>(items: T[], disallowedItems?: unknown[] | unknown): T | null {

    let blacklist: unknown[] | undefined = undefined;

    if(disallowedItems){
        blacklist= disallowedItems instanceof Array ? disallowedItems : [disallowedItems];
    }

    if(!items.some(item => !blacklist || blacklist.indexOf(item) < 0)){
        return null;
    }

    let randomIndex = Math.floor(items.length * Math.random());

    while(blacklist && blacklist.some(black => black === items[randomIndex])){
        let indexes = items.map((_, index) => index)
        indexes.splice(randomIndex, 1);
        
        randomIndex = getRandomItem(indexes);
    }

    return items.splice(randomIndex, 1)[0];
}