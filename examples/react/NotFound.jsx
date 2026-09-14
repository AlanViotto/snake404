import { useEffect, useRef } from "react";
import Snake404 from "snake404";
import "snake404/dist/snake404.css";

export default function NotFound() {
  const ref = useRef(null);

  useEffect(() => {
    const game = Snake404.init(ref.current, {
      labels: {
        subtitle: "Página não encontrada. Jogue uma partida antes de voltar."
      }
    });

    return () => game.destroy();
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, background: "#07090b" }}>
      <div ref={ref} style={{ width: "min(100%, 1000px)" }} />
    </main>
  );
}
