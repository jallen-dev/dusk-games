import { FruitType, Vector } from "./types"

export const GAME_DURATION = 5 * 60_000

export const CONTAINER_HEIGHT = 180
export const CONTAINER_WIDTH = 180

export const FRUIT_SIZES: Record<FruitType, number> = {
  [FruitType.Cherry]: 7,
  [FruitType.Strawberry]: 10,
  [FruitType.Grapes]: 12,
  [FruitType.Lemon]: 14,
  [FruitType.Orange]: 18,
  [FruitType.Apple]: 23,
  [FruitType.Pear]: 30,
  [FruitType.Banana]: 35,
  [FruitType.Pineapple]: 39,
  [FruitType.Watermelon]: 45,
}

export const FRUIT_IMAGES: Record<FruitType, string> = {
  [FruitType.Cherry]: "cherry",
  [FruitType.Strawberry]: "strawberry",
  [FruitType.Grapes]: "grapes",
  [FruitType.Lemon]: "lemon",
  [FruitType.Orange]: "orange",
  [FruitType.Apple]: "apple",
  [FruitType.Pear]: "pear",
  [FruitType.Banana]: "banana",
  [FruitType.Pineapple]: "pineapple",
  [FruitType.Watermelon]: "watermelon",
}

export const FRUIT_IMAGE_OFFSETS: Record<FruitType, Vector> = {
  [FruitType.Cherry]: { x: 0, y: -2 },
  [FruitType.Strawberry]: { x: 0, y: 0 },
  [FruitType.Grapes]: { x: 1, y: 0 },
  [FruitType.Lemon]: { x: 0, y: 0 },
  [FruitType.Orange]: { x: 0, y: 0 },
  [FruitType.Apple]: { x: 0, y: -2 },
  [FruitType.Pear]: { x: 5, y: -3 },
  [FruitType.Banana]: { x: 0, y: 0 },
  [FruitType.Pineapple]: { x: 0, y: -10 },
  [FruitType.Watermelon]: { x: 0, y: 0 },
}

export const FRUIT_SCALES: Record<FruitType, number> = {
  [FruitType.Cherry]: 0.18,
  [FruitType.Strawberry]: 0.22,
  [FruitType.Grapes]: 0.21,
  [FruitType.Lemon]: 0.25,
  [FruitType.Orange]: 0.25,
  [FruitType.Apple]: 0.31,
  [FruitType.Pear]: 0.32,
  [FruitType.Banana]: 0.3,
  [FruitType.Pineapple]: 0.32,
  [FruitType.Watermelon]: 0.34,
}
