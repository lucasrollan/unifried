type dateString = string
type dateTimeString = string

type IFragment = {
    id: string,
    title: string,
    priority?: number,
    role: string,
    content?: string,
    createdDate: dateString,
    modifiedDate: dateString,
    relatedTo?: string[],
    parentId?: string,
    status?: string,
    earliestStart?: dateTimeString,
    earliestStartDate?: dateString,
    start?: dateTimeString,
    startDate?: dateString,
    end?: dateTimeString,
    endDate?: dateString,
    location?: string,
    reward?: number,
    isCompleted: boolean,
    completionDate?: dateTimeString,
    meta?: string,
}

type IFragmentChallenge = IFragment | {
    type: 'challenge',
}

export default IFragment