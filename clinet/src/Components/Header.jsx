import React from "react";
import logo from "../Asset/logo.png";
const Header = () => {
  return (
    <div className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="wrapper">
              <div className="wrapper__body">
                <div className="logo__Section">
                  <img src={logo} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
