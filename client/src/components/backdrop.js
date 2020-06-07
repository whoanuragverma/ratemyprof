import React from "react";
import img1 from "../assets/bck1.jpg";
import img2 from "../assets/bck2.jpg";
const BackDrop = () => {
    return (
        <div className="background">
            <img src={img1} width={90} className="img1" alt="img1" />
            <img src={img2} width={140} className="img2" alt="img2" />
        </div>
    );
};

export default BackDrop;
