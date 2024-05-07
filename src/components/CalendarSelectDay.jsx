import { useEffect, useState, createContext, useContext } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { vi } from "date-fns/locale";

import { fetchAllAppointmentListById } from "../services/appointmentList";
import { fetchPatientById } from "../services/patients";
import { fetchAllAppointmentListPatients } from "../services/appointmentListPatients";
import "../pages/Home.scss";
import { queryClient } from "../App";
import { Link } from "react-router-dom";
import { useMyContext, compareDate } from "./SelectDayContext";



const css = `
        .my-today { 
            font-weight: bold;
            color: #d74f4a;
        }
    `;

function CalendarSelectDay() {
    const {selectedDay, setSelectedDay} = useMyContext();
    
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
              new Date(item?.appointmentList.scheduleDate.slice(0, 10)),
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
    const appointmentListPatientSelectedDay = appointmentListPatientSelectedDayQuery.data || [];
    const appointmentListUpcoming = appointmentListPatientSelectedDay.filter(
        (item) => !item.appointmentRecordId
    );

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["appointmentListSelectedDay"] });
    }, [selectedDay]);

    return ( 
        <div id="calendar" className="shadow rounded-2 p-3 w-20">
            <h6 className="calendar-title">Lịch</h6>
            <style>{css}</style>
            <div className="calendar-container">
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
            <h6 style={{ flex: 1, margin: 0 }}>Các ca khám sắp tới</h6>
            <Link to="/systems/examinations">Xem tất cả</Link>
            </div>
            <div className="patients-list">
            {appointmentListUpcoming.length > 0 ? (
                appointmentListUpcoming.map((item) => {
                return (
                    <div className="patient-item" key={item.id}>
                    <h6 className="patient-name">{item.patient?.fullName}</h6>
                    <h6 className="gender">
                        Giới tính: {item.patient?.gender}
                    </h6>
                    </div>
                );
                })
            ) : (
                <p style={{ marginTop: "12px", textAlign: "center" }}>
                Không có lịch khám
                </p>
            )}
            </div>
        </div>
    );
}

export default CalendarSelectDay;