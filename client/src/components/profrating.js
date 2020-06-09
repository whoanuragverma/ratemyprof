import React, { useState, useEffect } from "react";
import { Row, Col, Skeleton, Button, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import StarRatingComponent from "react-star-rating-component";
const ProfRating = (props) => {
    const [res, setRes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [butLoading, setbutLoading] = useState(false);
    let num = 0,
        avg = 0;
    const [hasPostedRating, sethasPostedRating] = useState();
    const [starValue, setStarValue] = useState(1);
    const view = () => {
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
    };
    useEffect(() => {
        view();
    }, []);
    const changeValue = (nextValue) => {
        setStarValue(nextValue);
    };
    const rating = () => {
        if (res.length === 0) {
            return "No ratings available";
        } else {
            res.forEach((element) => {
                num = num + 1;
                avg = avg + parseInt(element.rating);
            });
            return (
                <React.Fragment>
                    <span style={{ fontSize: 18, fontWeight: 400 }}>
                        {avg / num}{" "}
                    </span>
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="star"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        style={{ height: 14 }}
                    >
                        <path
                            fill="currentColor"
                            d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                            class=""
                        ></path>
                    </svg>
                    <br />
                    {num} Ratings
                </React.Fragment>
            );
        }
    };
    const postRating = () => {
        setbutLoading(true);
        fetch("/api/write_rating", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ FID: props.FID, rating: starValue }),
        })
            .then((res) => res.json())
            .then((res) => view());
    };
    const giveRating = () => {
        fetch("/api/check_rating", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ FID: props.FID }),
        })
            .then((res) => res.json())
            .then((res) => {
                sethasPostedRating(res.response);
            });
        if (!hasPostedRating) {
            return (
                <React.Fragment>
                    Looks like you have already rated.
                    <br />
                    Currently we don't allow to edit rating.{" "}
                    <span role="img">😢</span>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <div style={{ fontSize: 36 }}>
                        <Space size="middle">
                            <StarRatingComponent
                                name="rating"
                                value={starValue}
                                emptyStarColor="#d7d7d7"
                                onStarClick={changeValue}
                            />
                            <br />
                            <Button
                                type="dashed"
                                style={{ top: -12 }}
                                onClick={postRating}
                                loading={butLoading}
                            >
                                Post <ArrowRightOutlined />
                            </Button>
                        </Space>
                        <p style={{ fontSize: 12 }}>
                            Once you post the rating, you cannot edit it.
                        </p>
                    </div>
                </React.Fragment>
            );
        }
    };
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
                    boxShadow: "5px 5px 15px 0px #cdcdcd91",
                }}
            >
                <Row gutter={8} align="middle">
                    <Col lg={12} xs={24}>
                        <center>
                            <Skeleton paragraph={{ rows: 1 }} loading={loading}>
                                {rating()}
                            </Skeleton>
                        </center>
                    </Col>
                    <Col lg={12} xs={24}>
                        <center>
                            <Skeleton
                                paragraph={{ rows: 1 }}
                                loading={loading}
                                title={{ width: "55%" }}
                            >
                                {giveRating()}
                            </Skeleton>
                        </center>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default ProfRating;
