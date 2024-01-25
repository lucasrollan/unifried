import ICharacter from "./ICharacter"

class Character {
    data: ICharacter

    constructor(fragmentData: ICharacter) {
        this.data = fragmentData
    }

    validateInvariants(): void {
    }

    update(updates: Partial<ICharacter>): void {
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

    grantTokens(amount: number) {
        const currentTokens = this.data.tokens
        this.update({
            tokens: currentTokens + amount
        })
    }
}

export default Character