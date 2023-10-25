type dateString = string
type dateTimeString = string

type Fragment = {
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
}

export default Fragment