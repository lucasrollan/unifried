import Fragment from "./Fragment"
import CharacterRepository from "@/persistence/CharacterRepository"
import RewardService from "./RewardService"
import FragmentRepository from "@/persistence/FragmentRepository"
import FragmentFactory from "./FragmentFactory"

class FragmentService {
    static async markFragmentAsCompleted(fragment: Fragment): Promise<Fragment> {
        console.log('FragmentService.markFragmentAsCompleted')

        const updatedFragment = FragmentFactory.fromData(fragment.data)
        updatedFragment.update({
            completionDate: (new Date()).toISOString(),
            isCompleted: true,
            status: 'completed',
        })
        FragmentRepository.getInstance().patch(fragment.data)

        if (fragment.data.reward) {
            const character = await CharacterRepository.getInstance().getCurrentCharacter()
            RewardService.grantTokensToCharacter(character, fragment.data.reward)
        }

        return updatedFragment
    }
}

export default FragmentService