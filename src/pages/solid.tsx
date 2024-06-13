'use client'

import { handleIncomingRedirect, login, fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { WithResourceInfo, getContentType, getFile, getSolidDataset, getSourceUrl, saveSolidDatasetAt } from "@inrupt/solid-client";
import { useEffect } from 'react';
import { NamedNode, Parser, Prefixes, Quad } from 'n3';
import { Dictionary } from '@reduxjs/toolkit';

async function loginAndFetch() {
    // 1. Call the handleIncomingRedirect() function,
    //    - Which completes the login flow if redirected back to this page as part of login; or
    //    - Which is a No-op if not part of login.
    await handleIncomingRedirect();

    // 2. Start the Login Process if not already logged in.
    if (!getDefaultSession().info.isLoggedIn) {
        await login({
            oidcIssuer: "https://datapod.igrant.io/",
            redirectUrl: new URL("/solid", window.location.href).toString(),
            clientName: "SOLID APP TEST",
            tokenType: 'DPoP',
        });
    }

    // ...
    const exampleSolidDatasetURL = 'https://lucasrollan.datapod.igrant.io/social/NavarroAgustina.ttl';

    const file = await fetch(exampleSolidDatasetURL)
    const text = await file.text()
    console.log('file text', text)

    const parsed = await parseDataSet(text)
    console.log('parsed', parsed)

    // ...

    //   // For example, the user must be someone with Write access to the specified URL.
    //   const savedSolidDataset = await saveSolidDatasetAt(
    //     exampleSolidDatasetURL,
    //     myChangedDataset,
    //     { fetch: fetch }  // fetch function from authenticated session
    //   );
}

type DataSet = {
    quads: Quad[],
    prefixes: Dictionary<any>,
}
async function parseDataSet(doc: string): Promise<DataSet> {
    const parser = new Parser();
    const dataset: DataSet = {
        quads: [],
        prefixes: {},
    }

    const promise: Promise<DataSet> = new Promise((resolve, reject) => {
        parser.parse(
            doc,
            (error, quad, prefixes) => {
                if (error) {
                    reject(error)
                }

                if (quad) {
                    dataset.quads.push(quad)
                } else {
                    dataset.prefixes = prefixes

                    resolve(dataset)
                }
            });
    })

    return promise
}

export default function SolidTestPage() {
    useEffect(() => {
        loginAndFetch()
    }, [])

    return '🤷'
}