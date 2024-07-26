import { useGameStore } from "@/useGameStore"
import { costForUpgrade } from "@/utils"

import { Reveal } from "./Reveal"
import { Skill } from "./Skill"

export function Skills() {
  const level = useGameStore((state) => state.game.persisted[state.yourPlayerId].level)

  return (
    <div className="ml-4 w-full grow overflow-hidden overflow-y-auto">
      <Reveal show={level > 1}>
        <div className="mr-4 flex flex-col gap-2">
          <TapPower />
          <AutoTappers />
          <AutoTapperPower />
        </div>
      </Reveal>
    </div>
  )
}

function TapPower() {
  const skillPoints = useGameStore((state) => state.game.persisted[state.yourPlayerId].skillPoints)
  const tapPowerLevel = useGameStore((state) => state.game.persisted[state.yourPlayerId].skills.tapPower)

  const current = 2 ** tapPowerLevel
  const next = 2 ** (tapPowerLevel + 1)
  const cost = costForUpgrade("tapPower", tapPowerLevel)
  const canAfford = skillPoints >= cost
  return (
    <Skill>
      <Skill.Description>Tap Power: {current}x</Skill.Description>
      <Skill.Action>
        <button
          className="rounded-lg bg-blue-600 p-2 text-white disabled:bg-gray-500"
          disabled={!canAfford}
          onClick={() => Dusk.actions.upgrade("tapPower")}
        >
          <div>→ {next}x</div>
          <div>Cost: {cost} points</div>
        </button>
      </Skill.Action>
    </Skill>
  )
}

function AutoTappers() {
  const skillPoints = useGameStore((state) => state.game.persisted[state.yourPlayerId].skillPoints)
  const autoTappers = useGameStore((state) => state.game.persisted[state.yourPlayerId].skills.autoTappers)

  const next = autoTappers + 1
  const cost = costForUpgrade("autoTappers", autoTappers)
  const canAfford = skillPoints >= cost
  return (
    <Skill>
      <Skill.Description>
        <div>Auto Tappers: {autoTappers}</div>
        <div>(each taps once per second)</div>
      </Skill.Description>
      <Skill.Action>
        <button
          className="rounded-lg bg-blue-600 p-2 text-white disabled:bg-gray-500"
          disabled={!canAfford}
          onClick={() => Dusk.actions.upgrade("autoTappers")}
        >
          <div>→ {next}</div>
          <div>Cost: {cost} point</div>
        </button>
      </Skill.Action>
    </Skill>
  )
}

function AutoTapperPower() {
  const skillPoints = useGameStore((state) => state.game.persisted[state.yourPlayerId].skillPoints)
  const autoTapperPower = useGameStore((state) => state.game.persisted[state.yourPlayerId].skills.autoTapperPower)
  const level = useGameStore((state) => state.game.persisted[state.yourPlayerId].level)

  const current = 2 ** autoTapperPower
  const next = 2 ** (autoTapperPower + 1)
  const cost = costForUpgrade("autoTapperPower", autoTapperPower)
  const canAfford = skillPoints >= cost
  return (
    <Reveal show={level > 2}>
      <Skill>
        <Skill.Description>Auto Tapper Power: {current}x</Skill.Description>
        <Skill.Action>
          <button
            className="rounded-lg bg-blue-600 p-2 text-white disabled:bg-gray-500"
            disabled={!canAfford}
            onClick={() => Dusk.actions.upgrade("autoTapperPower")}
          >
            <div>→ {next}x</div>
            <div>Cost: {cost} points</div>
          </button>
        </Skill.Action>
      </Skill>
    </Reveal>
  )
}
