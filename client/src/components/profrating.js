import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
const ProfRating = (props) => {
    const [res, setRes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/read_rating", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ FID: props.FID }),
        })
            .then((res) => res.json())
            .then((res) => {
                setRes(res);
                setLoading(false);
            });
    }, []);
    return (
        <React.Fragment>
            <div
                style={{
                    maxWidth: 650,
                    width: "80%",
                    margin: "20px auto",
                    padding: 20,
                    border: "1px solid #eeeeee",
                    borderRadius: 10,
                    background: "#ffffff",
                }}
            >
                <Row gutter={10} align="middle">
                    <Col lg={12} xs={24}>
                        <b>Rating:</b>
                    </Col>
                    <Col lg={12} xs={24}>
                        <b>{JSON.stringify(res)}</b>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default ProfRating;
