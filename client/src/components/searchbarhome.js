import React from "react";
import { Row, Col, Input } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

function SearchBarHome() {
    return (
        <Row justify="center" align="middle" className="home">
            <Col xs={24} lg={12}>
                12
            </Col>
            <Col xs={24} lg={12}>
                <Input
                    addonAfter={<UserOutlined onClickCapture={alert("Hi")} />}
                    size="large"
                    placeholder="Search for professors..."
                    prefix={<SearchOutlined />}
                />
            </Col>
        </Row>
    );
}

export default SearchBarHome;
