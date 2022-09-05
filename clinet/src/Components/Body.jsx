import React from "react";
import Select from "react-select";
import { FaFilePdf } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
const Body = () => {
  const [data, setData] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  console.log(downloadLink);
  console.log(data);
  const fileChange = (e) => {
    let file = e.target.files["0"];
    uploadIMG(file);
  };
  // Upload File
  const uploadIMG = (file) => {
    let MyFormData = new FormData();
    MyFormData.append("uploaded_file", file);
    let config = { headers: { "Content-Type": "multipart/form-data" } };
    axios
      .post("http://localhost:5000/upload", MyFormData, config)
      .then((res) => {
        if (res.status === 200 && res.data === "success") {
          let ImageItem = {
            ImageName: file.name,
            ImageSrc: URL.createObjectURL(file),
          };
          // let ImgURL = URL.createObjectURL(file);
          setData([...data, ImageItem]);
        }
      });
  };

  const removeImg = (e) => {
    axios
      .post("http://localhost:5000/remove", { ImageName: e.ImageName })
      .then((res) => {
        if (res.status === 200 && res.data === "success") {
          let newData = data.filter((value) => value !== e);
          setData(newData);
        }
      });
  };

  // Create PDF

  const createPDF = () => {
    let ImgArrayData = data;
    if (data.length === 0) {
      alert("Mo Data");
    } else {
      // Loading.....
      let postBody = {
        ImgArrayData: ImgArrayData,
        // pageSize: "...",
        // pageMargin: "...",
        // ImgFit: "...",
      };

      axios
        .post("http://localhost:5000/createPDF", postBody)
        .then((res) => {
          if (res.status === 200) {
            setDownloadLink("/downloadPDF/" + res.data);
            console.log(res.data);
          } else {
            // Error ....
            alert("Error1");
          }
        })
        .catch((e) => {
          // Error ....
          alert("Error2");
        });
    }
  };

  const paperSize = [
    { value: "A4", label: "A4" },
    { value: "Letter", label: "Letter" },
    { value: "Legal", label: "Legal" },
    { value: "Tabloid", label: "Tabloid" },
    { value: "Executive", label: "Executive" },
  ];
  const marginSize = [
    { value: "No Margin", label: "No Margin" },
    { value: "Normal", label: "Normal" },
    { value: "Narrow", label: "Narrow" },
    { value: "Moderate", label: "Moderate" },
  ];
  const imageFit = [
    { value: "Image Top", label: "Image Top" },
    { value: "Image Center", label: "Image Center" },
    { value: "Image Bottom", label: "Image Bottom" },
    { value: "Image Cover", label: "Image Cover" },
    { value: "Image Stretch", label: "Image Stretch" },
  ];
  return (
    <div className="body">
      <div className="wrapper">
        <div className="wrapper__body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <div className="input__section">
                  <div className="input__body">
                    <input
                      type="file"
                      name="uploaded_file"
                      id="myInput"
                      className="d-none"
                      onChange={(e) => fileChange(e)}
                    />

                    <label className="my__btn text-center" htmlFor="myInput">
                      Add Image
                    </label>

                    <div className="input__inner">
                      <h3>Fill The Section</h3>
                      <div className="select__section">
                        <span>Paper Size</span>
                        <Select
                          className="select__color"
                          defaultValue={paperSize[0]}
                          options={paperSize}
                          styles={{
                            option: (provided, state) => ({
                              ...provided,
                              borderBottom: "1px solid #ddd",
                              color: state.isSelected ? "#fff" : "#666",
                              background: state.isSelected ? "#252525" : "#fff",
                              cursor: "pointer",
                              margin: "0px",
                              ":active": {
                                backgroundColor: "#ddd",
                                cursor: "pointer",
                              },
                            }),
                            singleValue: (provided, state) => ({
                              ...provided,
                              color: "#666",

                              fontSize: "15px",
                            }),
                            control: (styles) => ({
                              ...styles,
                              backgroundColor: "#ffffff",
                              padding: "0px 0px",
                              margin: "0px 0px",

                              ":focus-within": {
                                ...styles[":focus-within"],
                                border: "1px solid #ddd",
                                boxShadow: "none",
                              },
                            }),
                            menuList: (styles) => ({
                              ...styles,
                              margin: "0px",
                              padding: "0px",
                            }),
                            noOptionsMessage: (styles) => ({
                              ...styles,
                              background: "red",
                              color: "#fff",
                            }),
                          }}
                        />
                      </div>
                      <div className="select__section">
                        <span>Margin Size</span>
                        <Select
                          className="select__color"
                          defaultValue={marginSize[0]}
                          options={marginSize}
                          styles={{
                            option: (provided, state) => ({
                              ...provided,
                              borderBottom: "1px solid #ddd",
                              color: state.isSelected ? "#fff" : "#666",
                              background: state.isSelected ? "#252525" : "#fff",
                              cursor: "pointer",
                              margin: "0px",
                              ":active": {
                                backgroundColor: "#ddd",
                                cursor: "pointer",
                              },
                            }),
                            singleValue: (provided, state) => ({
                              ...provided,
                              color: "#666",

                              fontSize: "15px",
                            }),
                            control: (styles) => ({
                              ...styles,
                              backgroundColor: "#ffffff",
                              padding: "0px 0px",
                              margin: "0px 0px",

                              ":focus-within": {
                                ...styles[":focus-within"],
                                border: "1px solid #ddd",
                                boxShadow: "none",
                              },
                            }),
                            menuList: (styles) => ({
                              ...styles,
                              margin: "0px",
                              padding: "0px",
                            }),
                            noOptionsMessage: (styles) => ({
                              ...styles,
                              background: "red",
                              color: "#fff",
                            }),
                          }}
                        />
                      </div>
                      <div className="select__section">
                        <span>Image Fit</span>
                        <Select
                          className="select__color"
                          defaultValue={imageFit[0]}
                          options={imageFit}
                          styles={{
                            option: (provided, state) => ({
                              ...provided,
                              borderBottom: "1px solid #ddd",
                              color: state.isSelected ? "#fff" : "#666",
                              background: state.isSelected ? "#252525" : "#fff",
                              cursor: "pointer",
                              margin: "0px",
                              ":active": {
                                backgroundColor: "#ddd",
                                cursor: "pointer",
                              },
                            }),
                            singleValue: (provided, state) => ({
                              ...provided,
                              color: "#666",

                              fontSize: "15px",
                            }),
                            control: (styles) => ({
                              ...styles,
                              backgroundColor: "#ffffff",
                              padding: "0px 0px",
                              margin: "0px 0px",

                              ":focus-within": {
                                ...styles[":focus-within"],
                                border: "1px solid #ddd",
                                boxShadow: "none",
                              },
                            }),
                            menuList: (styles) => ({
                              ...styles,
                              margin: "0px",
                              padding: "0px",
                            }),
                            noOptionsMessage: (styles) => ({
                              ...styles,
                              background: "red",
                              color: "#fff",
                            }),
                          }}
                        />
                      </div>
                    </div>
                    <button className="my__btn mt-3" onClick={createPDF}>
                      <span>
                        <FaFilePdf />
                      </span>{" "}
                      Create PDF
                    </button>
                    {/* <a href={downloadLink}>Click</a> */}
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="preview__section">
                  <div className="row">
                    {data.map((item, index) => (
                      <div className="col-md-2">
                        <div className="preview__body">
                          <img
                            src={item.ImageSrc}
                            alt=""
                            className="img-fluid"
                          />
                          <button
                            className="my__btn mt-3"
                            onClick={(e) => removeImg(item)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
