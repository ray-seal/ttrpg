import React from "react";
import { House, houseThemes } from "../themes";

interface HouseShieldProps {
    house: House;
}

const HouseShield: React.FC<HouseShieldProps> = ({ house }) => {
    const shieldFilename = houseThemes[house].shield;

    const shieldSrc = '/assets/shields/${shieldFilename}';

    return (
        <img
        src={shieldSrc}
        alt={'${house} Shield'}
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30vw",
            maxWidth: "400px",
            height: "auto",
            opacity: 0.18,
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
        }}
        />
    );
};

export default HouseShield;