import React from "react";
import img1 from "../assets/bck1.png";
import img2 from "../assets/bck2.png";
import img3 from "../assets/bck3.png";
import img4 from "../assets/bck4.png";
import img5 from "../assets/bck5.png";
const BackDrop = () => {
    return (
        <div className="background">
            <img src={img1} width={90} className="img1" alt="img1" />
            <img src={img2} width={140} className="img2" alt="img2" />
            <img src={img3} width={140} className="img3" alt="img3" />
            <img src={img4} width={140} className="img4" alt="img4" />
            <img src={img5} width={200} className="img5" alt="img5" />
        </div>
    );
};

export default BackDrop;
