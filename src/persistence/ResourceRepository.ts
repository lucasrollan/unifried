import Airtable, { Attachment } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";


class ResourceRepository {
    private static instance: ResourceRepository | null = null
    private airtableDB: AirtableBase

    private constructor() {
        this.airtableDB = new Airtable().base('applyggDoSgqTOMEs');
    }

    static getInstance(): ResourceRepository {
        if (!ResourceRepository.instance) {
            ResourceRepository.instance = new ResourceRepository()
        }
        return ResourceRepository.instance
    }

    public async getResourceContent(iri: string): Promise<string | undefined> {
        console.log('getResourceContent iri', iri)
        return new Promise((resolve, reject) => {
            this.airtableDB('resources')
                .select({
                    maxRecords: 1,
                    filterByFormula: `{iri}='${iri}'`,
                })
                .firstPage(function(err, records) {
                    if (err) { console.error(err); return; }

                    if (!records || records.length === 0) {
                        console.error('no record found')
                        reject()
                        return
                    }

                    const content = records[0].fields['content'] as string;

                    console.log('getResourceContent content', content)

                    resolve(content)
                });
        })

    }

    public async getResourceFileUrl(iri: string): Promise<string | undefined> {
        console.log('getFileResourceUrl iri', iri)
        return new Promise((resolve, reject) => {
            this.airtableDB('resources')
                .select({
                    maxRecords: 1,
                    filterByFormula: `{iri}='${iri}'`,
                })
                .firstPage(function(err, records) {
                    if (err) { console.error(err); return; }

                    if (!records || records.length === 0) {
                        console.error('no record found')
                        reject()
                        return
                    }

                    const files = records[0].fields['file'] as Attachment[]
                    const file = files[0]
                    const url = file.url

                    console.log('getFileResourceUrl fileUrl', url)

                    resolve(url)
                });
        })

    }
}

export default ResourceRepository