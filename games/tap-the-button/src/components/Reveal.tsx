export function Reveal({ children, show = false }: { children: React.ReactNode; show?: boolean }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in ${show ? "h-fit opacity-100" : "h-0 opacity-0"}`}
    >
      {children}
    </div>
  )
}
