import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Input, Button, List, Avatar } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
const { Search } = Input;

const SearchFullPage = (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [display, setDisplay] = useState("d-none");
    const handleChange = (e) => {
        const name = e.target.value;
        name ? setDisplay() : setDisplay("d-none");
        setLoading(true);
        fetch("api/find/v1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name }),
        })
            .then((res) => res.json())
            .then((res) => {
                setLoading(false);
                setData(res);
            });
    };
    return (
        <React.Fragment>
            <Row justify="center" align="middle" className="search">
                <Col lg={14} sm={20}>
                    <Search
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
                        enterButton
                        size="large"
                        name="name"
                        onChange={handleChange}
                        loading={loading}
                        autoFocus
                        autoComplete={false}
                    />
                </Col>
            </Row>
            <Row justify="center" align="middle">
                <Col lg={14} sm={24} className="mobile-res">
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        locale={{ emptyText: " " }}
                        className={display}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <Link to={`/ID/${item.FID}`}>
                                            {item.name}
                                        </Link>
                                    }
                                    description={item.department}
                                    avatar={
                                        <Avatar
                                            src={item.image}
                                            alt="IMAGE"
                                            size={48}
                                        />
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default SearchFullPage;
