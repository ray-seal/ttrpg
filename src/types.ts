export interface Character {
  id?: string;
  name: string;
  house: string;
  experience: number;
  level: number;
  magic: number;
  knowledge: number;
  courage: number;
  agility: number;
  charisma: number;
  unlockedSpells?: string[];
  equippedSpells?: string[];
  completedLessons?: string[];
  hasTimetable?: boolean;
  flags?: { [key: string]: boolean | string };
  items?: string[]; // Add this!
  currentSceneId?: string;
  wizarding_money?: number;
}
