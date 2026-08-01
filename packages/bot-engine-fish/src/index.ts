import { BotEngineCapabilities, BotEngineInterface, BotEngineSuggestionResult, GameState, getCellKey, HexCoordinate } from "@ih3t/shared";

class FishBotEngine implements BotEngineInterface {
    getDisplayName(): string {
        return `Fish Engine`;
    }

    getCapabilities(): Readonly<BotEngineCapabilities> {
        return {
            suggestTurn: true,
            suggestMove: false,
        };
    }

    async suggestMove(_gameState: GameState, _timeoutMs: number): Promise<BotEngineSuggestionResult<HexCoordinate>> {
        return { status: `failure`, message: `not supported`, metadata: {} };
    }

    async suggestTurn(gameState: GameState, _timeoutMs: number): Promise<BotEngineSuggestionResult<[HexCoordinate, HexCoordinate]>> {
        const occupied = new Set(
            gameState.cells.map(cell => getCellKey(cell.x, cell.y))
        );

        const availableMoves: HexCoordinate[] = [];

        for (let radius = 0; availableMoves.length < gameState.placementsRemaining; radius++) {
            for (let x = -radius; x <= radius; x++) {
                for (let y = -radius; y <= radius; y++) {
                    if (!occupied.has(getCellKey(x, y))) {
                        availableMoves.push({ x, y });
                    }
                }
            }
        }

        const firstIndex = Math.floor(Math.random() * availableMoves.length);
        const firstMove = availableMoves.splice(firstIndex, 1)[0];

        const secondIndex = Math.floor(Math.random() * availableMoves.length);
        const secondMove = availableMoves[secondIndex];

        await new Promise(resolve => setTimeout(resolve, 250));

        return {
            status: `provide`,
            suggestion: [firstMove, secondMove],
            metadata: {},
        };
    }

    shutdown(): void {}
}

export default async function () {
    return new FishBotEngine();
}
