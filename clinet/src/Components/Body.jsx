import React from "react";
import Select from "react-select";
import { FaFilePdf } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
const Body = () => {
  const [data, setData] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [paperSize, setPaperSize] = useState({ value: "A4", label: "A4" });
  const [marginSize, setMarginSize] = useState({
    value: 0,
    label: "No Margin",
  });
  const [imageFit, setImageFit] = useState({
    value: "Auto",
    label: "Auto",
  });

  const fileChange = (e) => {
    const image = new Image();
    image.src = e.target.files["0"];

    let file = e.target.files["0"];

    let fileExtension = file.name.split(".").pop();
    let validFileExtensions = ["jpg", "JPG", "jpeg", "JPEG", "PNG", "png"];
    if (file.size > 1000000) {
      toast.error("File Very Big! Upload up to 1MB", {
        duration: 3000,
        position: "bottom-center",
      });
    } else if (!validFileExtensions.includes(fileExtension)) {
      toast.error("Only JPG, JPEG, PNG are allow!", {
        duration: 2000,
        position: "bottom-center",
      });
    } else {
      uploadIMG(file);
    }
  };
  // Upload File
  const uploadIMG = (file) => {
    let MyFormData = new FormData();
    MyFormData.append("uploaded_file", file);
    let config = { headers: { "Content-Type": "multipart/form-data" } };
    axios
      .post("https://react-pdf.amitjs.com/upload", MyFormData, config)
      .then((res) => {
        if (res.status === 200 && res.data === "success") {
          let ImageItem = {
            ImageName: file.name,
            ImageSrc: URL.createObjectURL(file),
          };
          setData([...data, ImageItem]);
        }
      });
  };

  const removeImg = (e) => {
    axios
      .post("https://react-pdf.amitjs.com/remove", { ImageName: e.ImageName })
      .then((res) => {
        if (res.status === 200 && res.data === "success") {
          let newData = data.filter((value) => value !== e);
          setData(newData);
          toast.success("Remove File Success!", {
            duration: 3000,
            position: "bottom-center",
          });
        } else {
          toast.error("Something went Wrong! Try again.", {
            duration: 2000,
            position: "bottom-center",
          });
        }
      });
  };

  // Create PDF

  const createPDF = () => {
    let ImgArrayData = data;
    if (data.length === 0) {
      toast.error("No File Found!", {
        duration: 3000,
        position: "bottom-center",
      });
    } else {
      // Loading.....
      let postBody = {
        ImgArrayData: ImgArrayData,
        paperSize: paperSize.value,
        marginSize: marginSize.value,
        imageFit: imageFit.value,
      };

      axios
        .post("https://react-pdf.amitjs.com/createPDF", postBody)
        .then((res) => {
          if (res.status === 200) {
            setDownloadLink("/downloadPDF/" + res.data);
            console.log(res.data);
          } else {
            toast.error("Something went Wrong!", {
              duration: 2000,
              position: "bottom-center",
            });
          }
        })
        .catch((e) => {
          toast.error("Something went Wrong!", {
            duration: 2000,
            position: "bottom-center",
          });
        });
    }
  };

  const dismiss = () => {
    toast.dismiss();
    setDownloadLink("");
  };

  const paperSizeData = [
    { value: "A4", label: "A4" },
    { value: "B4", label: "B4" },
    { value: "Letter", label: "Letter" },
    { value: "Legal", label: "Legal" },
    { value: "Tabloid", label: "Tabloid" },
    { value: "Executive", label: "Executive" },
  ];
  const marginSizeData = [
    { value: 0, label: "No Margin" },
    { value: 24, label: "Normal" },
    { value: 12, label: "Narrow" },
    { value: 18, label: "Moderate" },
  ];
  const imageFitData = [
    { value: "Auto", label: "Auto" },
    { value: "Fit", label: "Fit" },
    { value: "Cover", label: "Cover" },
  ];

  return (
    <div className="main__container">
      <div>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{ duration: 500000 }}
        />
      </div>

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
                          defaultValue={paperSizeData[0]}
                          onChange={setPaperSize}
                          options={paperSizeData}
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
                          defaultValue={marginSizeData[0]}
                          options={marginSizeData}
                          onChange={setMarginSize}
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
                          defaultValue={imageFitData[0]}
                          options={imageFitData}
                          onChange={setImageFit}
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
                      </span>
                      Create PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="preview__section">
                  <div className="container">
                    <div className="row">
                      {data.map((item, index) => (
                        <div key={index} className="col-md-3">
                          <div className="preview__img__file">
                            <div className="preview__body">
                              <div
                                className={`img__file__body ${paperSize.value} `}
                              >
                                <div
                                  className={`img__file  ${marginSize.label} ${imageFit.value}`}
                                >
                                  <img
                                    src={item.ImageSrc}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                              </div>
                              <span
                                className="close mt-3"
                                onClick={(e) => removeImg(item)}
                              >
                                <AiFillCloseCircle />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {downloadLink !== "" &&
            toast.custom(
              <div className="body__download">
                <div className="download">
                  <p>Are You Want to Download This PDF File?</p>
                  <a href={`https://react-pdf.amitjs.com` + downloadLink}>
                    <button className="my__btn" onClick={dismiss}>
                      Download PDF
                    </button>
                  </a>
                  <button className="my__btn ml-4 dismiss" onClick={dismiss}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Body;
