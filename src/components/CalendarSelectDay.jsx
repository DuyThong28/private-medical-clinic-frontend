import { useEffect, useState, createContext, useContext } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { vi } from "date-fns/locale";

import { fetchAllAppointmentListById } from "../services/appointmentList";
import { fetchPatientById } from "../services/patients";
import { fetchAllAppointmentListPatients } from "../services/appointmentListPatients";
import "../pages/Home.scss";
import { queryClient } from "../main";
import { Link } from "react-router-dom";
import { useMyContext, compareDate } from "./SelectDayContext";
import useAuth from "../hooks/useAuth";

const css = `
        .my-today { 
            font-weight: bold;
            color: #d74f4a;
        }
    `;

function CalendarSelectDay() {
  const { selectedDay, setSelectedDay } = useMyContext();
  const { auth } = useAuth();
  const permission = auth.permission || [];

  const optionQuery = function (queryKey, optionFilter = (data) => data) {
    return {
      queryKey: [queryKey],
      queryFn: async () => {
        const data = await fetchAllAppointmentListPatients();
        const finalData = await Promise.all(
          data.map(async (item) => {
            const patient = await fetchPatientById({ id: item.patientId });
            const appointmentList = await fetchAllAppointmentListById({
              id: item.appointmentListId,
            });

            return {
              ...item,
              patient,
              appointmentList,
            };
          })
        );
        const searchData = optionFilter(finalData);
        return searchData;
      },
    };
  };

  const getListAppointmentBySelectedDay = (data) => {
    const finalData = data.filter(
      (item) =>
        compareDate(
          new Date(item?.appointmentList.scheduleDate?.slice(0, 10)),
          selectedDay
        ) === 0
    );
    return finalData;
  };
  const query2 = optionQuery(
    "appointmentListSelectedDay",
    getListAppointmentBySelectedDay
  );
  const appointmentListPatientSelectedDayQuery = useQuery(query2);
  const appointmentListPatientSelectedDay =
    appointmentListPatientSelectedDayQuery.data || [];
  const appointmentListUpcoming = appointmentListPatientSelectedDay.filter(
    (item) => !item.appointmentRecordId
  );
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentListSelectedDay"] });
  }, [selectedDay]);

  return (
    <div
      id="calendar"
      className=" rounded-3 p-3 w-20"
      style={{
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="calendar-container mb-2">
        <DayPicker
          locale={vi}
          weekStartsOn={1}
          defaultMonth={new Date()}
          selected={selectedDay}
          onSelect={setSelectedDay}
          mode="single"
          modifiersClassNames={{
            today: "my-today",
          }}
          showOutsideDays
        ></DayPicker>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h6 className="fw-bold text-dark" style={{ flex: 1, margin: 0 }}>
          Ca khám sắp tới
        </h6>
        {permission.includes("RAppointment") && (
          <Link to="/examinations" className="link-all">
            Xem tất cả
          </Link>
        )}
      </div>
      <div className="patients-list">
        {appointmentListUpcoming.length > 0 ? (
          appointmentListUpcoming.map((item) => {
            return (
              <div className="patient-item gap-2 " key={item.id}>
                <div
                  style={{
                    height: "2.4rem",
                    width: "2.4rem",
                    borderRadius: "0.5rem",
                    color: "white",
                    textAlign: "center",
                    fontSize: "1.25rem",
                  }}
                  className="position-relative order"
                >
                  <div className="position-absolute translate-middle top-50 start-50">
                    {item.orderNumber}
                  </div>
                </div>
                <div className="d-flex flex-column justify-content-between">
                  <h6 className="patient-name row">{item.patient?.fullName}</h6>
                  <h6 className="gender row">
                    Giới tính: {item.patient?.gender}
                  </h6>
                </div>
              </div>
            );
          })
        ) : (
          <div className="position-relative w-100 h-100">
            <div className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
              <p style={{ width: "max-content" }}>Không có ca khám</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarSelectDay;
