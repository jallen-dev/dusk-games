import * as RAPIER from "@dimforge/rapier2d-compat"
import { Assets } from "@pixi/assets"
import { SCALE_MODES } from "@pixi/constants"
import { useEffect, useState } from "react"

export const useLoadAssets = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    Promise.all([load(), RAPIER.init()]).then(() => setAssetsLoaded(true))
  }, [])

  return assetsLoaded
}

function load() {
  Assets.add([
    {
      alias: "cherry",
      src: "./images/fruit/cherry.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "strawberry",
      src: "./images/fruit/strawberry.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "grapes",
      src: "./images/fruit/grapes.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "lemon",
      src: "./images/fruit/lemon.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "orange",
      src: "./images/fruit/orange.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "apple",
      src: "./images/fruit/apple.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "pear",
      src: "./images/fruit/pear.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "banana",
      src: "./images/fruit/banana.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "pineapple",
      src: "./images/fruit/pineapple.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "watermelon",
      src: "./images/fruit/watermelon.png",
      data: { scaleMode: SCALE_MODES.NEAREST },
    },
    {
      alias: "explosion_1",
      src: "./images/explosion/explosion_1.png",
    },
    {
      alias: "explosion_2",
      src: "./images/explosion/explosion_2.png",
    },
    {
      alias: "explosion_3",
      src: "./images/explosion/explosion_3.png",
    },
    {
      alias: "explosion_4",
      src: "./images/explosion/explosion_4.png",
    },
    {
      alias: "explosion_5",
      src: "./images/explosion/explosion_5.png",
    },
    {
      alias: "explosion_6",
      src: "./images/explosion/explosion_6.png",
    },
    {
      alias: "explosion_7",
      src: "./images/explosion/explosion_7.png",
    },
    {
      alias: "explosion_8",
      src: "./images/explosion/explosion_8.png",
    },
    {
      alias: "explosion_9",
      src: "./images/explosion/explosion_9.png",
    },
    {
      alias: "background",
      src: "./images/bg.png",
    },
    {
      alias: "arrow_down",
      src: "./images/arrow_down.png",
    },
  ])

  return Assets.load([
    "cherry",
    "strawberry",
    "grapes",
    "lemon",
    "orange",
    "apple",
    "pear",
    "banana",
    "pineapple",
    "watermelon",
    "explosion_1",
    "explosion_2",
    "explosion_3",
    "explosion_4",
    "explosion_5",
    "explosion_6",
    "explosion_7",
    "explosion_8",
    "explosion_9",
    "background",
    "arrow_down",
  ])
}
