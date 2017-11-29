import React from "react";

import Head from "next/head";
import Link from "next/link";

import { Layout, Menu } from "antd";

const { Footer, Content, Header } = Layout;

const App = ({ children, pathname }) => (
  <Layout>
    <Head>
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/antd/2.9.3/antd.min.css"
      />
    </Head>
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        style={{ lineHeight: "64px" }}
      >

        <Menu.Item key="1">
          <Link prefetch href="/">
            <a className={pathname === "/" && "is-active"}>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link prefetch href="/about">
            <a className={pathname === "/about" && "is-active"}>About</a>
          </Link>
        </Menu.Item>
      </Menu>

    </Header>
    <Content style={{ padding: "0 50px" }}>
      <article style={{ background: "#fff", padding: 24, minHeight: 280 }}>
        {children}
      </article>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Path of Exile Indexer ©2017 Created by Akash Singh
    </Footer>
  </Layout>
);

export default App;
