import IFragment from "./IFragment"

class Fragment {
    data: IFragment

    constructor(fragmentData: IFragment) {
        this.data = fragmentData
    }

    validateInvariants(): void {
        if (this.data.role === 'task') {
            if (this.data.status === 'completed' || this.data.completionDate || this.data.isCompleted) {
                // if one of these is defined, the all have to be defined
                if (this.data.status !== 'completed' || !this.data.completionDate || !this.data.isCompleted) {
                    console.log('INVALID FRAGMENT')
                    console.log(this.data)
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
        this.update({
            completionDate: (new Date()).toISOString(),
            isCompleted: true,
            status: 'done',
        })
    }
}

export default Fragment