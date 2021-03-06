import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { ZEITUIProvider, CSSBaseline } from '@zeit-ui/react';
import { JssProvider } from 'react-jss';

import Menu from "components/Menu";
import Header from "components/Header";
import ConnectivityContent from "components/Content/ConnectivityContent";
import WarpContent from "components/Content/WarpContent";
import Footer from "components/Footer";

export default function Home() {
  const [themeType, setThemeType] = useState('light');
  const toggleDarkMode = () => setThemeType(themeType === 'dark' ? 'light' : 'dark');

  const [iata, setIata] = useState(false);

  useEffect(() => {
    !iata && fetch("iata-c.json").then(e => e.json()).then(e => setIata(e));
  }, []);

  return (
    <JssProvider id={{ minify: true }}>
      <ZEITUIProvider theme={{ type: themeType }}>
        <CSSBaseline />
        <Head>
          <title>Cloudflare Diagnostics</title>
          <meta name="description" content="This tools provides diagnosis for Cloudflare services including DNS, Connectivity & Warp." />
          <meta name="robots" content="index, follow" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="author" content="Akshat Mittal" />
          <link rel="icon" href="favicon.ico" />
          <link rel="shortcut icon" href="favicon.ico" />
        </Head>
        <Menu toggleDarkMode={toggleDarkMode} />
        <Header which="connectivity" />
        <ConnectivityContent iata={iata} />
        <Header which="warp" />
        <WarpContent iata={iata} />
        <Footer />
      </ZEITUIProvider>
    </JssProvider>
  );
}
