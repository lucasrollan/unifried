type dateString = string

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
    earliestStart?: dateString,
    start?: dateString,
    end?: dateString,
    location?: string,
    reward?: number,
}

export default Fragment