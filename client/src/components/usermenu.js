import React, { useState } from "react";
import SearchBarHome from "./searchbarhome";
import { Modal, Typography, Tabs, Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined, SmileOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;
const UserMenu = () => {
    const [emailValidate, setemailValidate] = useState();
    const [emailValidateError, setemailValidateError] = useState();
    const [passwordValidate, setpasswordValidate] = useState();
    const [passwordValidateError, setpasswordValidateError] = useState();
    const [loading, setLoading] = useState(false);
    const [display, setDisplay] = useState("d-none");
    const onFinishSignUp = (values) => {
        setLoading(true);
        setDisplay("d-none");
        setemailValidate();
        setemailValidateError();
        setpasswordValidate();
        setpasswordValidateError();
        fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((res) => {
                if ("error" in res) {
                    res.error.forEach((element) => {
                        if (element.param === "email") {
                            setemailValidate("error");
                            setemailValidateError(element.msg);
                        } else if (element.param === "password") {
                            setpasswordValidate("error");
                            setpasswordValidateError(
                                "Password must be atleast 6 characters long."
                            );
                        }
                    });
                } else if (res.code === 0) {
                    setemailValidate("error");
                    setemailValidateError(res.message);
                } else if (res.code === 1) {
                    setDisplay("");
                }
            });
        setLoading(false);
    };
    const onFinishLogin = (values) => {
        setLoading(true);
        setemailValidate();
        setemailValidateError();
        setpasswordValidate();
        setpasswordValidateError();
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((res) => {
                if ("error" in res) {
                    res.error.forEach((element) => {
                        if (element.param === "email") {
                            setemailValidate("error");
                            setemailValidateError(element.msg);
                        } else if (element.param === "password") {
                            setpasswordValidate("error");
                            setpasswordValidateError(element.message);
                        }
                    });
                }
                if (res.code === 0) {
                    setemailValidate("error");
                    setemailValidateError(res.message);
                } else if (res.code === 1) {
                    setpasswordValidate("error");
                    setpasswordValidateError(res.message);
                } else if (res.code === 2) {
                    localStorage.setItem("auth", res.auth);
                    localStorage.setItem("token", res.token);
                    window.location.reload();
                }
            });
        setLoading(false);
    };
    const auth = localStorage.getItem("auth");
    const token = localStorage.getItem("token");
    if (!auth || !token) {
        return (
            <React.Fragment>
                <SearchBarHome />
                <Modal visible footer={null} closable={false} centered>
                    <Title className="title-small" level={3}>
                        Hang On!
                    </Title>
                    We hate spam too, this is just an additional step to prevent
                    spam.
                    <Tabs defaultActiveKey={1} tabBarGutter={30}>
                        <TabPane tab="Login" key={1}>
                            <Form name="login" onFinish={onFinishLogin}>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter your Email!",
                                        },
                                    ]}
                                    type="email"
                                    validateStatus={emailValidate}
                                    help={emailValidateError}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter your Password!",
                                        },
                                    ]}
                                    validateStatus={passwordValidate}
                                    help={passwordValidateError}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Password"
                                        size="large"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Log In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane tab="Sign Up" key={2}>
                            <Form name="signup" onFinish={onFinishSignUp}>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter your Email!",
                                        },
                                    ]}
                                    type="email"
                                    validateStatus={emailValidate}
                                    help={emailValidateError}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter your name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<SmileOutlined />}
                                        placeholder="Name"
                                        size="large"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter your Password!",
                                        },
                                    ]}
                                    validateStatus={passwordValidate}
                                    help={passwordValidateError}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Password"
                                        size="large"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Sign Up
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Alert
                                message="SignUp Successfull.. Login to Continue"
                                type="success"
                                showIcon
                                banner
                                className={display}
                            />
                        </TabPane>
                    </Tabs>
                </Modal>
            </React.Fragment>
        );
    } else if (auth === "pending") {
        return "OTP NOT VERIFIED";
    }
};
export default UserMenu;
