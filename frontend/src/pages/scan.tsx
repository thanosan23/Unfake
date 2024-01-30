//@ts-nocheck
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { QrReader } from 'react-qr-reader';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as appId } from '../../../backend/backend.did.js';

const canisterID = 'canister id here';

export default function Scan() {
    const [data, setData] = useState('No result');
    const [loading, setLoading] = useState(true);
    const [myApp, setMyApp] = useState(null);

    useEffect(() => {
        const agent = new HttpAgent();
        const myApp = Actor.createActor(appIdl, { agent, canisterId: canisterID });
        setMyApp(myApp);
    }, []);

    return (
        <>
            <Head>
                <title>Unfake</title>
                <meta name="description" content="codex" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="justify-center items-center">
                <div className="pl-30">
                    <h1
                        className="pl-10 font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Scan.
                    </h1>
                </div>
                <div className="h-screen flex items-center justify-center">
                    <div className="w-1/2 h-full">
                        <QrReader
                            onResult={async (result, error) => {
                                if (!!result) {
                                    setData(result?.text);
                                    const value = await myApp.scan({ data: result.text });
                                    if (value.found == false) {
                                        window.open("http://localhost:3000/fake");
                                    } else {
                                        window.open("http://localhost:3000/real");
                                    }
                                }
                                if (!!error) {
                                    console.info(error);
                                }
                            }}
                        />
                        <p className="hidden">{data}</p>
                    </div>
                </div>
                <div>

                </div>
            </main>
        </>
    );
}