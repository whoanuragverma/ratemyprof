import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Avatar, Button, Space, Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
const ProfDetail = (props) => {
    const [res, setRes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/find/v2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ FID: props.FID }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.length === 0) {
                    window.location.href = "/search";
                }
                setRes(res[0]);
                setLoading(false);
            });
    }, []);
    return (
        <div
            style={{
                maxWidth: 650,
                width: "80%",
                margin: "5% auto 0 auto",
                padding: 20,
                border: "1px solid #eeeeee",
                borderRadius: 10,
                background: "#ffffff",
                boxShadow: "5px 5px 15px 0px #cdcdcd91",
            }}
        >
            <Row gutter={10} align="middle">
                <Col lg={12} xs={24}>
                    <Space size="large">
                        <Button
                            type="dashed"
                            onClick={() => (window.location.href = "/search")}
                        >
                            <ArrowLeftOutlined />
                        </Button>
                        <Skeleton
                            avatar={{ size: 150, shape: "square" }}
                            paragraph={{ rows: 0 }}
                            title={{ width: 0 }}
                            loading={loading}
                            active
                        >
                            <Avatar src={res.image} shape="square" size={150} />
                        </Skeleton>
                    </Space>
                </Col>
                <Col
                    lg={12}
                    xs={24}
                    gutter={3}
                    style={{ paddingTop: 10, fontSize: "1.1em" }}
                >
                    <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
                        <Title level={4}>{res.name}</Title>
                        {res.designation}
                        <br />
                        <b>Department: </b>
                        {res.department}
                        <br />
                        <b>School: </b>
                        {res.school}
                        <br />
                        <b>Cabin: </b>
                        {res.cabin}
                        <br />
                        <b>Email: </b>
                        <a href={`mailto:${res.email}`}>{res.email}</a>
                        <br />
                        <br />
                        <Text type="secondary" style={{ fontSize: "0.8em" }}>
                            {res._id}
                        </Text>
                    </Skeleton>
                </Col>
            </Row>
        </div>
    );
};

export default ProfDetail;
