import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Layout from "../components/layout";
import { store } from '@/store'
import { Provider as StateProvider } from 'react-redux'
import '../main.css'
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

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

