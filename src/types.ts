export interface Character {
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
  flags?: { [key: string]: boolean };
  items?: string[]; // Add this!
  currentSceneId?: string;
}
