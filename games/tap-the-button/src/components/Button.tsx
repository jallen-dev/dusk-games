import "./Button.css"

export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button className="pushable mb-14" onClick={onClick}>
      <span className="shadow"></span>
      <span className="edge"></span>
      <span className="front">{children}</span>
    </button>
  )
}
