import React from "react";

const ProgressBar = ({ value, max }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    let BEM_class = "";

    if (percentage > 90) BEM_class = "danger";
    else if (percentage > 70) BEM_class = "warning";

    return (
        <div className="progress-bar">
            <div
                className={`progress-bar-inner ${BEM_class}`}
                style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
