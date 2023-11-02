import IFragment from "./IFragment"

class Fragment {
    fragment: IFragment

    constructor(fragment: IFragment) {
        this.fragment = fragment
    }

    validateInvariants(): void {
        if (this.fragment.role === 'task') {
            if (this.fragment.status === 'completed' || this.fragment.completionDate || this.fragment.isCompleted) {
                // if one of these is defined, the all have to be defined
                if (this.fragment.status !== 'completed' || !this.fragment.completionDate || !this.fragment.isCompleted) {
                    console.log('INVALID FRAGMENT')
                    console.log(this.fragment)
                    throw new Error('Task completed with invalid values')
                }
            }
        }
    }

    update(fragment: IFragment, updates: Partial<IFragment>): void {
        const updatedFragment = {
            ...fragment,
            ...updates,
        }

        this.validateInvariants()

        this.fragment = updatedFragment
    }

    serialize(): string {
        return JSON.stringify(this.fragment)
    }
}

export default Fragment