export function Skill({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-4">{children}</div>
}

function SkillDescription({ children }: { children: React.ReactNode }) {
  return <div className="grow">{children}</div>
}

function SkillAction({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

Skill.Description = SkillDescription
Skill.Action = SkillAction
