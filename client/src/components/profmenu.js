import React from "react";
import BackDrop from "../components/backdrop";
import ProfDetail from "../components/profdetail";
import ProfRating from "./profrating";
import ProfReview from "./profreview";
const ProfMenu = ({ match, location }) => {
    const id = match.params.id;
    const auth = localStorage.getItem("auth");
    const token = localStorage.getItem("token");
    const verifyToken = async (t) => {
        await fetch("/api/verify", {
            method: "GET",
            headers: {
                "x-access-token": t,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.response) {
                    window.location.href = "/user";
                }
            });
    };
    if (auth !== "true") {
        verifyToken(" ");
    }
    verifyToken(token);
    return (
        <React.Fragment>
            <BackDrop />
            <ProfDetail FID={id} />
            <ProfRating FID={id} />
            <ProfReview FID={id} />
        </React.Fragment>
    );
};

export default ProfMenu;
