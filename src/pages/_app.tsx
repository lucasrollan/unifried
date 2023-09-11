import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Layout from "@/components/layout";

function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}

export default App;

