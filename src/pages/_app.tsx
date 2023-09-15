import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Layout from "@/components/layout";
import { store } from '@/store'
import { Provider as StateProvider } from 'react-redux'

function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <StateProvider store={store}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </StateProvider>
        </SessionProvider>
    );
}

export default App;

