import CharacterRepository from "@/persistence/CharacterRepository";
import Character from "./Character";

class RewardService {
    static async grantTokensToCharacter(character: Character, amount: number) {
        console.log('RewardService.grantTokensToCharacter', character.data.id, '->', amount)
        character.grantTokens(amount)

        await CharacterRepository.getInstance().patch(character)
    }
}

export default RewardService