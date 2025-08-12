export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export const houseThemes: Record<House, {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    shield: string;
}> = {
    Gryffindor: {
        primary: "#7F0909",
        secondary: "#FFC500",
        accent: "#FFDB58",
        background: "#FFF8E1",
        shield: "gryffindor.jpg",
    },
    Slytherin: {
        primary: "#0D6217",
        secondary: "#AAAAAA",
        accent: "#1A472A",
        background: "#F2F2F2",
        shield: "slytherin.jpg",
    },
    Ravenclaw: {
        primary: "#222F5B",
        secondary: "#944B2D",
        accent: "#5D7B9D",
        background: "#E3E9F3",
        shield: "ravenclaw.jpg",
    },
    Hufflepuff: {
        primary: "#FFDB00",
        secondary: "#60605C",
        accent: "#FFF4B1",
        background: "#F7F7F7",
        shield: "hufflepuff.png",
    },
};