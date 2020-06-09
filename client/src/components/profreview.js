import React, { useEffect, useState } from "react";
import { List, Avatar, Skeleton } from "antd";

const ProfReview = (props) => {
    const [res, setRes] = useState([]);
    const [Name, setName] = useState("");
    const [loading, setLoading] = useState(true);
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
            </div>
        </React.Fragment>
    );
};

export default ProfReview;
