import React, { useEffect, useState } from "react";
import {
  AWBody,
  AWCell,
  AWH,
  AWHead,
  AWRow,
  ApprovalWidgetContainer,
  ApprovalWidgetTitle,
  ApprovalWidgetTable,
  ApprovalWidgetTableContainer,
  ApprovalWidgetHeader,
} from "./approval-widget.styles";
import data from "../../userData.json";
import { TextDrpDwn } from "../form-elements/form-elements.component";
import { Col } from "react-bootstrap";

const ApprovalWidget = ({ lg }) => {
  const [filteredArray, SetFilteredArray] = useState({});
  const [displayApprovals, setDisplayApprovals] = useState([]);

  useEffect(() => {
    if (!filteredArray.length) return;
    setDisplayApprovals(filteredArray.sortedArray);
  }, [filteredArray]);

  useEffect(() => {
    const distApp = data.map((dat) => {
      const time = dat.registered.slice(5, 10);
      return {
        priority: dat.prioprity,
        time: time,
        name: dat.name,
        purpose: dat.title,
      };
    });
    setDisplayApprovals(distApp);
  }, []);

  const handleSortAction = (e, arrayToSort) => {
    if (!arrayToSort) return;
    const sortValue = e.target.value;

    switch (sortValue) {
      case "priority": {
        const priorityMap = {
          High: 2,
          Medium: 1,
          Low: 0,
        };

        const sortedArray = arrayToSort;

        sortedArray.sort(function (a, b) {
          const aPriority = priorityMap[a.priority];
          const bPriority = priorityMap[b.priority];

          if (aPriority > bPriority) return -1;
          if (aPriority < bPriority) return 1;
          return 0;
        });
        console.log(sortedArray);

        return SetFilteredArray({ sortedArray, sortValue });
      }
      case "name": {
        const sortedArray = arrayToSort;

        sortedArray.sort(function (a, b) {
          const aFirstLetter = a.name[0];
          const bFirstLetter = b.name[0];

          if (aFirstLetter > bFirstLetter) return 1;
          if (aFirstLetter < bFirstLetter) return -1;
          return 0;
        });
        console.log(sortedArray);

        return SetFilteredArray({ sortedArray, sortValue });
      }
      case "purpose": {
        const sortedArray = arrayToSort;

        sortedArray.sort(function (a, b) {
          const aFirstLetter = a.purpose[0];
          const bFirstLetter = b.purpose[0];

          if (aFirstLetter > bFirstLetter) return 1;
          if (aFirstLetter < bFirstLetter) return -1;
          return 0;
        });
        console.log(sortedArray);

        return SetFilteredArray({ sortedArray, sortValue });
      }
      case "due date": {
        const sortedArray = arrayToSort;

        sortedArray.sort(function (a, b) {
          const aTime = a.time.split("-").join("");
          const bTime = b.time.split("-").join("");

          if (aTime > bTime) return 1;
          if (aTime < bTime) return -1;
          return 0;
        });
        console.log(sortedArray);

        return SetFilteredArray({ sortedArray, sortValue });
      }

      default:
        break;
    }
  };
  return (
    <ApprovalWidgetContainer lg={4}>
      <ApprovalWidgetHeader>
        <ApprovalWidgetTitle>Approval requests </ApprovalWidgetTitle>
        <TextDrpDwn
          sortOption={true}
          options={["priority", "due date", "name", "purpose"]}
          handleChange={(e) => handleSortAction(e, displayApprovals)}
        />
      </ApprovalWidgetHeader>

      <ApprovalWidgetTableContainer>
        <ApprovalWidgetTable striped>
          <AWHead className="headText">
            <AWRow>
              <AWH>PRIORITY</AWH>
              <AWH>Due</AWH>
              <AWH>Name</AWH>
              <AWH>Purpose</AWH>
            </AWRow>
          </AWHead>
          <AWBody>
            {displayApprovals.map((dat) => {
              const rand = Math.random() * 10000000;

              return (
                <AWRow key={rand}>
                  <AWCell priority={`${dat.priority}`}>
                    <span className="priority">{dat.priority}</span>
                  </AWCell>
                  <AWCell>{dat.time}</AWCell>
                  <AWCell>{dat.name}</AWCell>
                  <AWCell>{dat.purpose}</AWCell>
                </AWRow>
              );
            })}
          </AWBody>
        </ApprovalWidgetTable>
      </ApprovalWidgetTableContainer>
    </ApprovalWidgetContainer>
  );
};

export default ApprovalWidget;