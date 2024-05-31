import React from "react";
import clsx from "clsx";

const Pill = ({ variant = "base", children }) => {
  return (
    <div
      className={clsx(
        "flex items-center border rounded-md md:rounded-full md:inline-block py-2 px-2 md:px-3 text-sm mt-2 min-h-fit",
        {
          "border-primary text-red": variant === "primary",
          "border-black text-black": !variant || variant === "base",
          "border-red-700 text-red-700": variant === "primary",
        }
      )}
    >
      {children}
    </div>
  );
};

export default Pill;
