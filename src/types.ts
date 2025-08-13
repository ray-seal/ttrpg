export type House = "Gryffindor" | "Hufflepuff" | "Ravenclaw" | "Slytherin";

export interface Character {
    name: string;
    house: House;
    magic: number;
    knowledge: number;
    courage: number;
    agility: number;
    charisma: number;
    level: number;
    experience: number;
};