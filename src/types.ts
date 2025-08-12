import { House } from "./themes";

export type Character = {
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