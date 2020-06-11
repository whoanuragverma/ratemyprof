import React, { useEffect, useState } from "react";
import {
    List,
    Avatar,
    Skeleton,
    Divider,
    Form,
    Input,
    Switch,
    Button,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const ProfReview = (props) => {
    const [res, setRes] = useState([]);
    const [Name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);
    const [hasGivenReview, sethasGivenReview] = useState(false);
    const [Butloading, setButloading] = useState(false);
    const view = () => {
        fetch("/api/read_review", {
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
    const findUser = (UID, anonymous) => {
        if (anonymous) {
            return "Anonymous";
        } else {
            var name;
            fetch("/api/findUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ UID: UID }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setName(res.name);
                });

            return Name;
        }
    };
    const backgroundC = () => {
        return {
            backgroundColor:
                "#" + Math.floor(Math.random() * 16777215).toString(16),
        };
    };
    const handleClick = () => {
        setChecked(!checked);
    };
    const toNormalDate = (d) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const date = new Date(d);
        return (
            monthNames[date.getMonth()] +
            " " +
            date.getDate() +
            ", " +
            date.getFullYear()
        );
    };
    const sendReview = (values) => {
        values.anonymous = checked;
        setButloading(true);
        fetch("/api/write_review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                anonymous: values.anonymous,
                review: values.review,
                FID: props.FID,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                view();
            });
    };
    const giveUserComments = () => {
        fetch("/api/check_review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ FID: props.FID }),
        })
            .then((res) => res.json())
            .then((res) => sethasGivenReview(res.response));
        if (!hasGivenReview) {
            return (
                <React.Fragment>
                    <Divider style={{ margin: "10px 0 10px 0" }} />
                    <center>
                        We limit the number of certain actions you perform on
                        this site to prevent <b>spam</b>.<br />
                        Looks like you have already written something. Currently
                        we don't allow to edit reviews.
                    </center>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Divider style={{ margin: "10px 0 10px 0" }} />
                    <Form name="userReview" onFinish={sendReview}>
                        <Form.Item name="anonymous" valuePropName="checked">
                            <b>Posting as </b>
                            <Switch
                                unCheckedChildren={
                                    <React.Fragment>Yourself 😎</React.Fragment>
                                }
                                checkedChildren={
                                    <React.Fragment>
                                        Anonymous 🕵🏻‍♂️
                                    </React.Fragment>
                                }
                                onClick={handleClick}
                            />
                        </Form.Item>
                        <Form.Item
                            name="review"
                            rules={[
                                {
                                    required: true,
                                    message: "Write something first!",
                                },
                            ]}
                        >
                            <TextArea
                                placeholder="Write something here. Once you post the review, you cannot edit it. "
                                autoSize={{ minRows: 3, maxRows: 10 }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="dashed"
                                htmlType="submit"
                                loading={Butloading}
                                style={{
                                    position: "relative",
                                    left: "100%",
                                    transform: "translateX(-100%)",
                                }}
                            >
                                Post {<ArrowRightOutlined />}
                            </Button>
                        </Form.Item>
                    </Form>
                </React.Fragment>
            );
        }
    };
    const UserComments = () => {
        if (res.length === 0) {
            return (
                <React.Fragment>
                    <center>No reviews yet. 😿 Write one now.</center>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    Showing {res.length} reviews
                    <List
                        itemLayout="horizontal"
                        dataSource={res}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar size={48} style={backgroundC()}>
                                            {
                                                findUser(
                                                    item.UID,
                                                    item.anonymous
                                                )[0]
                                            }
                                        </Avatar>
                                    }
                                    title={
                                        <React.Fragment>
                                            {findUser(item.UID, item.anonymous)}
                                            <p align="left">
                                                Posted on{" "}
                                                {toNormalDate(item.created_at)}
                                            </p>
                                        </React.Fragment>
                                    }
                                    description={
                                        <React.Fragment>
                                            <p
                                                style={{
                                                    fontWeight: 400,
                                                    fontSize: "1.2em",
                                                }}
                                            >
                                                {item.review}
                                            </p>
                                        </React.Fragment>
                                    }
                                />
                            </List.Item>
                        )}
                    />
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
                <Skeleton loading={loading}>{UserComments()}</Skeleton>
                <Skeleton loading={loading}>{giveUserComments()}</Skeleton>
            </div>
        </React.Fragment>
    );
};

export default ProfReview;
