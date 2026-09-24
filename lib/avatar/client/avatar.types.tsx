"use client";

import {
    FaCrown,
    FaCat,
    FaDog,
    FaFish,
    FaFrog,
    FaDragon,
    FaSpider,
    FaGhost,
    FaSkull,
    FaHatWizard,
    FaRocket,
    FaCar,
    FaFilm,
    FaClapperboard,
    FaCamera,
    FaMasksTheater,
    FaTicket,
    FaStar,
    FaHeart,
    FaFire,
    FaBolt,
    FaMoon,
    FaSun,
    FaGamepad,
    FaPizzaSlice,
    FaIceCream,
    FaBurger,
    FaToiletPaper,
    FaPoop,
} from "react-icons/fa6";
import { GiPopcorn } from "react-icons/gi";

export const AVATAR_COLORS_PRIMARY = [
    "#E63946", // Red
    "#F77F00", // Orange
    "#F9C74F", // Yellow
    "#70A800", // Green
    "#00A878", // Teal
    "#00A6D6", // Cyan
    "#277DA1", // Blue
    "#5E60CE", // Indigo
    "#9B5DE5", // Purple
    "#F15BB5", // Pink
];

export const AVATAR_COLORS_SECONDARY = [
    "#F4A3AA", // Light red
    "#F8C18A", // Light orange
    "#FBE5A8", // Light yellow
    "#B8D18A", // Light green
    "#8FD0BE", // Light teal
    "#8BCFDF", // Light cyan
    "#91B8C9", // Light blue
    "#A5A7DF", // Light indigo
    "#C9A8E8", // Light purple
    "#F0A9D0", // Light pink
];

export const AVATAR_ICONS = {
    crown: FaCrown,
    cat: FaCat,
    dog: FaDog,
    fish: FaFish,
    frog: FaFrog,
    dragon: FaDragon,
    spider: FaSpider,
    ghost: FaGhost,
    skull: FaSkull,
    wizard: FaHatWizard,
    rocket: FaRocket,
    car: FaCar,
    film: FaFilm,
    clapperboard: FaClapperboard,
    camera: FaCamera,
    theater: FaMasksTheater,
    popcorn: GiPopcorn,
    movie_ticket: FaTicket,
    star: FaStar,
    heart: FaHeart,
    fire: FaFire,
    lightning: FaBolt,
    moon: FaMoon,
    sun: FaSun,
    gamepad: FaGamepad,
    pizza: FaPizzaSlice,
    ice_cream: FaIceCream,
    burger: FaBurger,
    toilet_paper: FaToiletPaper,
    poop: FaPoop,
} as const;