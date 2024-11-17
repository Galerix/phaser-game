import { getScores } from "../database/get-scores";

const ScoreBoard = async () => {
  const scores = await getScores();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-400 font-mono p-4 sm:p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-300 border-b border-gray-800 pb-2">
          Mejores puntuaciones
        </h1>
        <div className="space-y-2">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded"
            >
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{`${index + 1}.`}</span>
                <span className="text-gray-300">{score.playerName}</span>
              </div>
              <span className="text-cyan-400 font-bold">{score.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;