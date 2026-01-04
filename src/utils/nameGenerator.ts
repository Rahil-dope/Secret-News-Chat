const adjectives = [
    'Happy', 'Lucky', 'Sunny', 'Clever', 'Brave', 'Gentle', 'Jolly', 'Kind',
    'Lively', 'Nice', 'Proud', 'Silly', 'Witty', 'Zany', 'Calm', 'Eager',
    'Fancy', 'Glamorous', 'Helpful', 'Merry'
];

const animals = [
    'Panda', 'Koala', 'Lion', 'Tiger', 'Bear', 'Rabbit', 'Fox', 'Wolf',
    'Elephant', 'Giraffe', 'Zebra', 'Monkey', 'Penguin', 'Owl', 'Hawk',
    'Eagle', 'Dolphin', 'Whale', 'Shark', 'Octopus'
];

export const generateAnimalName = (): string => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective} ${randomAnimal}`;
};
