import React, { useState } from "react";
import SearchBarHome from "./searchbarhome";
import { Modal, Typography, Tabs, Form, Input, Button, Space } from "antd";
import {
    UserOutlined,
    LockOutlined,
    SmileOutlined,
    LockFilled,
    LogoutOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const UserMenu = () => {
    const auth = localStorage.getItem("auth");
    const token = localStorage.getItem("token");
    const [emailValidate, setemailValidate] = useState();
    const [emailValidateError, setemailValidateError] = useState();
    const [passwordValidate, setpasswordValidate] = useState();
    const [passwordValidateError, setpasswordValidateError] = useState();
    const [OTPValidate, setOTPValidate] = useState();
    const [OTPValidateError, setOTPValidateError] = useState();
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [Name, setName] = useState("Smelly Cat");
    const [VCheck, setVCheck] = useState(0);
    const onFinishSignUp = (values) => {
        setLoading1(true);
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
                    onFinishLogin(values);
                }
            });
        setLoading1(false);
    };
    const onFinishLogin = (values) => {
        setLoading2(true);
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
                    generateOTP(res.token);
                    localStorage.setItem("auth", res.auth);
                    localStorage.setItem("token", res.token);
                    window.location.reload();
                } else if (res.code === 3) {
                    localStorage.setItem("auth", res.auth);
                    localStorage.setItem("token", res.token);
                    window.location.href = "/";
                }
            });
        setLoading2(false);
    };
    const generateOTP = async (token) => {
        await fetch("/api/generateOTP", {
            method: "GET",
            headers: {
                "x-access-token": token,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.code === 2 || res.code === 1) {
                    setOTPValidate("warning");
                    setOTPValidateError(res.message);
                }
            });
    };
    const verifyToken = () => {
        if (VCheck !== 0) {
            return null;
        }
        setVCheck(VCheck + 1);
        fetch("/api/verify", {
            method: "GET",
            headers: {
                "x-access-token": token,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.response) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("auth");
                    window.location.reload();
                } else {
                    setName(res.decoded);
                }
            });
    };
    const onFinishOTP = (values) => {
        setLoading1(true);
        fetch("/api/validateOTP", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.code === 1) {
                    setOTPValidate("error");
                    setOTPValidateError(res.message);
                } else if (res.code === 0) {
                    localStorage.setItem("auth", res.auth);
                    window.location.href = "/";
                } else if (res.code === 4) {
                    setOTPValidate("error");
                    setOTPValidateError("OTP expired. Resend a new one!");
                }
            });
        setLoading1(false);
    };
    const resendOTP = () => {
        generateOTP(token);
    };
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
                                        loading={loading1}
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
                                        loading={loading2}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Sign Up
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
            </React.Fragment>
        );
    } else if (auth === "pending") {
        return (
            <React.Fragment>
                <SearchBarHome />
                <Modal visible footer={null} closable={false} centered>
                    <Title className="title-small" level={3}>
                        One last thing..
                    </Title>
                    We need to verify your email before you can continue.
                    <div className="otpbox">
                        An OTP has been sent to your registered email.
                    </div>
                    <Form name="otp" onFinish={onFinishOTP}>
                        <Form.Item
                            name="OTP"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter the OTP!",
                                },
                            ]}
                            validateStatus={OTPValidate}
                            help={OTPValidateError}
                        >
                            <Input
                                maxLength={4}
                                prefix={<LockFilled />}
                                size="large"
                                placeholder="Enter your OTP"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Space size="middle">
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    loading={loading1}
                                >
                                    Verify
                                </Button>
                                <Button
                                    htmlType="button"
                                    type="dashed"
                                    gutter={2}
                                    onClick={resendOTP}
                                >
                                    Resend
                                </Button>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("auth");
                                        window.location.reload();
                                    }}
                                >
                                    {<LogoutOutlined />} Logout
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    } else if (auth === "true") {
        verifyToken();
        return (
            <React.Fragment>
                <SearchBarHome />
                <Modal
                    centered
                    footer={null}
                    visible
                    onCancel={() => (window.location.href = "/")}
                >
                    <Title level={3}>Hi, {Name.name}</Title>
                    You are already loggend in. 😎 🙌
                    <br />
                    <br />
                    <Button
                        type="primary"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("auth");
                            window.location.reload();
                        }}
                    >
                        {<LogoutOutlined />} Logout
                    </Button>
                    <br /> <br />
                    <Text type="secondary">{Name._id}</Text>
                    <br />
                    <Text strong>Made with ❤ in India</Text>
                </Modal>
            </React.Fragment>
        );
    } else {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        window.location.reload();
    }
};
export default UserMenu;
