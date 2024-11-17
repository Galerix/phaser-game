import Game from "@/components/game";
import ScoreBoard from "@/components/ScoreBoard";

export default function Home() {
  return (
    <div className="grid grid-cols-3">
      <div id="game-container" className="col-span-2 w-full h-screen">
        <Game />
      </div>
      <ScoreBoard />
    </div>
  );
}

