import React from "react";
import { Row, Col, Input, Button, Typography, notification } from "antd";
import {
    SearchOutlined,
    UserOutlined,
    GithubOutlined,
} from "@ant-design/icons";
import ReactTypingEffect from "react-typing-effect";
import BackDrop from "./backdrop";
const { Title } = Typography;

function SearchBarHome() {
    const notify = () => {
        if (sessionStorage["badge"] === undefined) {
            sessionStorage["badge"] = true;
        }
        if (sessionStorage["badge"] === "true") {
            notification.info({
                message: "Liked it? 😍",
                description: (
                    <React.Fragment>
                        Star or contribute to this project on{" "}
                        <a
                            href="https://github.com/whoanuragverma/ratemyprof"
                            target="_blank"
                            rel="norefferer"
                        >
                            GitHub.
                        </a>
                    </React.Fragment>
                ),
                duration: 8,
                icon: <GithubOutlined />,
                placement: "bottomLeft",
                closeIcon: " ",
            });
            sessionStorage["badge"] = false;
        }
    };
    return (
        <React.Fragment>
            {notify()}
            <BackDrop />
            <Row justify="center" align="middle" className="home">
                <Col xs={24} lg={12}>
                    <Title className="title">
                        I think my professor is&nbsp;
                        <ReactTypingEffect
                            text={[
                                "kinda cool.",
                                "way too chill.",
                                "a superhero.",
                                "a tough grader.",
                                "ignoring my mails.",
                                "blacklisted.",
                                "awesome.",
                            ]}
                            eraseDelay={1500}
                            speed={100}
                        />
                    </Title>
                </Col>
                <Col xs={24} lg={12}>
                    <Input
                        suffix={
                            <Button
                                type="text"
                                icon={
                                    <UserOutlined
                                        onClick={() =>
                                            (window.location.href = "/user")
                                        }
                                    />
                                }
                            />
                        }
                        placeholder="Search for professors..."
                        prefix={<SearchOutlined />}
                        onClick={() => (window.location.href = "/search")}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default SearchBarHome;
