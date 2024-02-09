import Fragment from "./Fragment"
import CharacterRepository from "@/persistence/CharacterRepository"
import RewardService from "./RewardService"
import FragmentRepository from "@/persistence/FragmentRepository"
import FragmentFactory from "./FragmentFactory"
import IFragment from "./IFragment"

class FragmentService {
    static async patchFragment(id: string, data: IFragment): Promise<Fragment> {
        console.log('FragmentService.updateFragment')

        const currentFragment = await FragmentRepository.getInstance().getById(id)
        if (!currentFragment) {
            throw new Error('ERR00004')
        }

        const updatedData = await FragmentRepository.getInstance().patch(data)
        const updatedFragment = FragmentFactory.fromData(updatedData)

        if (updatedFragment.data.status === 'completed' && currentFragment.data.status !== 'completed') {
            // the fragment was moved to completed status
            FragmentService.markFragmentAsCompleted(updatedFragment)
        } else if (updatedFragment.data.status !== 'completed' && currentFragment.data.status === 'completed') {
            // the fragment was moved from completed status to something else
            FragmentService.unmarkFragmentAsCompleted(updatedFragment)
        }

        return updatedFragment
    }

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

    static async unmarkFragmentAsCompleted(fragment: Fragment): Promise<Fragment> {
        console.log('FragmentService.markFragmentAsCompleted')

        const updatedFragment = FragmentFactory.fromData(fragment.data)
        updatedFragment.update({
            completionDate: undefined,
            isCompleted: false,
        })
        FragmentRepository.getInstance().patch(fragment.data)

        if (fragment.data.reward) {
            // remove tokens granted
            const character = await CharacterRepository.getInstance().getCurrentCharacter()
            RewardService.grantTokensToCharacter(character, -fragment.data.reward)
        }

        return updatedFragment
    }
}

export default FragmentService