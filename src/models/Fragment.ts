import IFragment from "./IFragment"

class Fragment {
    data: IFragment

    constructor(fragmentData: IFragment) {
        this.data = fragmentData
    }

    validateInvariants(): void {
        return;
        if (this.data.role === 'task') {
            if (this.data.status === 'completed' || this.data.completionDate || this.data.isCompleted) {
                // if one of these is defined, the all have to be defined
                if (this.data.status !== 'completed' || !this.data.completionDate || !this.data.isCompleted) {
                    throw new Error('Task completed with invalid values')
                }
            }
        }
    }

    update(updates: Partial<IFragment>): void {
        const previousData = this.data

        const updatedData = {
            ...this.data,
            ...updates,
        }
        this.data = updatedData

        try {
            this.validateInvariants()
        } catch (e) {
            this.data = previousData // roll back
            throw e
        }
    }

    serialize(): string {
        return JSON.stringify(this.data)
    }

    markAsComplete() {
        this
    }
}

export default Fragment