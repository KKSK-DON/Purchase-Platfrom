/** @format */

import { Layout, Dropdown, Menu, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";

const { Header, Content } = Layout;

function App() {
  const [authed, setAuthed] = useState(false); // 假设没登陆
  // [状态的getter 状态的getter]

  //兜底，一旦刷新页面在token没有过期前，能防止登出
  useEffect(() => {
    // 希望只做一次所以didMoment
    //token valid 在util里check 了
    const authToken = localStorage.getItem("authToken");
    setAuthed(authToken !== null);
  }, []); // [] -> 导致这个函数只执行一次

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      message.success("Order placed!");
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthed(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setAuthed(false);
  };

  const renderContent = () => {
    if (authed === undefined) {
      return <></>;
    }

    if (!authed) {
      return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    return <HomePage />;
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
          App Store
        </div>
        {authed && (
          <div>
            <Dropdown trigger="click" overlay={userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </div>
        )}
      </Header>
      <Content
        style={{ height: "calc(100% - 64px)", padding: 20, overflow: "auto" }}
        // auto智能显示滚动条如果里面内容太多
      >
        {renderContent()}
      </Content>
      <Footer />
    </Layout>
  );
}

export default App;
