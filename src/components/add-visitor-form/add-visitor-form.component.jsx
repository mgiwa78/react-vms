import React, { useEffect, useState } from "react";
import {
  AddProfileFormContainer,
  FormRow,
  FormTitle,
} from "./add-visitor-form.styles";
import {
  FormInput,
  FormInputLabel,
  TextDrpDwnSelect,
} from "../form-elements/form-elements.styles";
import {
  TextDrpDwn,
  TextInput,
} from "../form-elements/form-elements.component";
import { useSelector } from "react-redux";
import CustomBtn from "../custom-btn/custom-btn.component";
import { SelectEmployeData } from "../../store/employee/employee-selector";
import {
  CreateNewUserWithData,
  FetchCheckInDataInDb,
  FetchUserDataAsync,
} from "../../php/phpFuncs";
import {
  SetCheckInLogAction,
  SetEmployeeAction,
} from "../../store/employee/employee-actions";
import { useDispatch } from "react-redux";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Col, Row } from "react-bootstrap";

const AddProfileForm = () => {
  const dispatch = useDispatch();

  const EmployeeData = useSelector(SelectEmployeData);
  const Ant = async () => {
    const a = await FetchUserDataAsync({ key: "ACTION", value: 1 });
    dispatch(SetEmployeeAction(a));
    const b = await FetchCheckInDataInDb({ key: "ACTION", value: 12 });
    dispatch(SetCheckInLogAction(b));
  };
  useEffect(() => {
    if (Object.keys(EmployeeData).length) return;
    Ant();
  }, []);
  const DefFormFields = {
    personnel_ID: "",
    position: " ",
    name: "",
    priority: "",
    purpose: "",
    date: "",
    pesRes: "",
    duration: "",
    dept: "",
  };

  const [formFields, SetFormFields] = useState(DefFormFields);

  const [startDate, setStartDate] = useState(new Date(1667246643633));
  const [stopDate, setStopDate] = useState(new Date());
  const { dept, personnel_ID, position, name, priority, purpose, pesRes } =
    formFields;
  const handleClearFormFileds = (e) => {
    // FetchUniqueUserData(personnel_ID);
    SetFormFields({
      ...DefFormFields,
    });
  };

  const handleGenerateId = (e) => {
    const allIDs = EmployeeData.map((data) => data.ID);
    let newID = 0;
    while (allIDs.includes(`${newID}`)) {
      newID = newID + 1;
    }
    const newDate = new Date();
    newDate.getMilliseconds();
    // const CurDate = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()} ${newDate.getHours()}-${newDate.getMinutes()}}`;
    SetFormFields({ ...formFields, personnel_ID: newID, date: newDate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "personnel_ID") return;
    SetFormFields({ ...formFields, [name]: value });
  };
  const handleGetDate = (date) => {
    console.log(date);
    const months = {
      1: "jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    };

    return `${date.getFullYear()}-${
      months[date.getMonth()]
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };
  const [BtnState, setBtnState] = useState("Update");

  const handleDatabaseUpdate = async (e) => {
    if (BtnState !== "Update") return;
    setBtnState("Updating");

    // FetchUniqueUserData(personnel_ID);
    if (
      !personnel_ID === "" ||
      purpose === "" ||
      name === "" ||
      position === "" ||
      pesRes === "" ||
      priority === "" ||
      dept === ""
    ) {
      setBtnState("Update");
      return alert("invalid Fields Found");
    } else {
      const date = Date.now();
      const duration = `${Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds()
      )}-${Date.UTC(
        stopDate.getFullYear(),
        stopDate.getMonth(),
        stopDate.getDate(),
        stopDate.getHours(),
        stopDate.getMinutes(),
        stopDate.getSeconds()
      )}`;
      const data = await CreateNewUserWithData({
        personnel_ID,
        purpose,
        date,
        name,
        dept,
        position,
        duration,
        pesRes,
        priority,
      });
      console.log(
        personnel_ID,
        purpose,
        date,
        name,
        dept,
        duration,
        position,
        pesRes,
        priority
      );

      if (data) {
        setTimeout(async () => {
          setBtnState("Updated");
          await Ant();
          setTimeout(async () => {
            handleClearFormFileds();

            setBtnState("Update");
          }, 500);
        }, 2000);
      } else {
        setBtnState("Update");
      }
    }
  };
  const color = "#000";

  return (
    <AddProfileFormContainer lg={6}>
      <FormTitle>Create new personel profile</FormTitle>
      <FormRow className="Bttom">
        <TextInput
          bg={color}
          value={personnel_ID}
          handleChange={(e) => handleInputChange(e)}
          name="personnel_ID"
          lg={3}
          label="Gen Id"
          InputPosition="form_input"
        />

        <CustomBtn
          handleClick={(e) => handleGenerateId(e)}
          size="lg"
          form_btn
          state={`${BtnState === "Update" ? "active" : "off"}`}
        >
          Gen
        </CustomBtn>
      </FormRow>
      <FormRow className="Bttom">
        <TextInput
          handleChange={(e) => handleInputChange(e)}
          bg={color}
          lg={4}
          value={name}
          name="name"
          label="Name"
          InputPosition="form_input"
        />
        <TextInput
          bg={color}
          handleChange={(e) => handleInputChange(e)}
          name="purpose"
          value={purpose}
          label="Purpose"
          lg={4}
          InputPosition="form_input"
        />
        <TextInput
          handleChange={(e) => handleInputChange(e)}
          bg={color}
          value={priority}
          name="priority"
          label="Priority"
          lg={4}
          InputPosition="form_input"
        />
      </FormRow>
      <FormRow className="Bttom">
        <TextDrpDwn
          handleChange={(e) => handleInputChange(e)}
          bg={color}
          lg={4}
          name="position"
          options={["employee", "IT personel", "management", "visitor", " "]}
          label="Position"
          value={position}
        />
        <TextInput
          handleChange={(e) => handleInputChange(e)}
          bg={color}
          lg={4}
          value={dept}
          name="dept"
          label="Department"
          InputPosition="form_input"
        />
        <TextInput
          handleChange={(e) => handleInputChange(e)}
          bg={color}
          lg={4}
          value={pesRes}
          name="pesRes"
          label="Personel responsible"
          InputPosition="form_input"
        />
      </FormRow>
      <FormRow className="Bttom">
        <FormInputLabel className="dateLabel">Select duration</FormInputLabel>
        <Col className="datePickerContainer" lg={5}>
          <div className="dateContainer">
            <DatePicker
              className="datePicker"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setStopDate(date);
              }}
            />
            <DatePicker
              className="datePicker"
              selected={stopDate}
              onChange={(date) => {
                console.log(startDate);
                setStopDate(date);
              }}
              style={{ width: "200px" }}
            />
          </div>
        </Col>
        <CustomBtn
          handleClick={(e) => handleDatabaseUpdate(e)}
          state={`${BtnState === "Update" ? "active" : "off"}`}
          form_btn
          lg={6}
          size="lg"
          className="red"
        >
          {BtnState}
        </CustomBtn>
        <CustomBtn
          handleClick={(e) => handleClearFormFileds(e)}
          form_btn
          lg={3}
          btnType="red"
        >
          Cancel
        </CustomBtn>
      </FormRow>
    </AddProfileFormContainer>
  );
};

export default AddProfileForm;