import Card from '../../../components/Card'
import TableHeader from '../../../components/TableHeader';
import TableBody from '../../../components/TableBody';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faChartSimple, faEye } from '@fortawesome/free-solid-svg-icons';
import SelectTime from '../../../components/SelectTime';
import * as React from 'react';

import {
  fetchAllAppointmentList
} from '../../../services/appointmentList';
import {
  fetchAllAppointmentRecordDetails
} from '../../../services/appointmentRecordDetails';
import {
  fetchAllAppointmentRecords
} from '../../../services/appointmentRecords';

import { useRef, useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { queryClient } from "../../../App";
import './Medicine.scss'
import { fetchAllDrugs, fetchDrugById,} from '../../../services/drugs'
import { fetchAllUnit } from "../../../services/units";
import Chart from 'chart.js/auto';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar,Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

function Medicine() {

  const drugsQuery = useQuery({
    queryKey: ["druglist"],
    queryFn: () => {
      return fetchAllDrugs({ });
    },
  });

  const drugs = drugsQuery.data;

  const [listState, setListState] = useState([]);

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });

  const unitState = unitsQuery.data;
  function getUnitName({ id }) {
    if(unitState == null) return;
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res?.unitName || "";
  }

  useEffect(() => {
    setListState(() => drugs);
  }, [drugs]);

  const recorddtQuery = useQuery({
    queryKey: ["recorddetaillist"],
    queryFn: () => {
      return fetchAllAppointmentRecordDetails();
    }, 
  });
  const recorddt = recorddtQuery.data;
  const recordQuery = useQuery({
    queryKey: ["recordlist"],
    queryFn: () => {
      return fetchAllAppointmentRecords();
    }, 
  });
  const record = recordQuery.data;
  const appointmentQuery = useQuery({
    queryKey: ["appointmentlist"],
    queryFn: () => {
      return fetchAllAppointmentList();
    }, 
  });
  const appointment = appointmentQuery.data;
  const ConvernToArray = (obj) => {
    let arr = []
    if(obj != null) 
        obj.map((apt) => {
            arr.push(apt);
    })
    return arr;
}

const recDetList = ConvernToArray(recorddt);
const recList = ConvernToArray(record);
const aptList = ConvernToArray(appointment);
const drugList = ConvernToArray(drugs);

  function searchHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    const result = drugs.filter((drug) =>
      drug.drugName.toLowerCase().includes(textSearch)
    );
    setListState(() => result);
  }

    const [selectItem, setSelectItem] = useState({});
    const setDetailItem = (item) => {
        getDataForChartWeek(valueTime, item);
        setSelectItem(item);
    }

    // Select Time
    const [valueTime, setValueTime] = React.useState(dayjs());
    const setNewTime = (value) => {
        setValueTime(value);
        getDataForChartWeek(value, selectItem);
    }
    const getWeekStartAndEnd = (selectedDay) => {
        const startOfWeek = selectedDay.startOf('week');
        const endOfWeek = startOfWeek.add(6, 'days');
        return { start: startOfWeek, end: endOfWeek };
    };
    const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);
    const handleOpenCalendar = (value) => {
        setIsOpenCalendar(value);
    }

    const countDrugInRecord = (item) => {
      let cnt = 0;
      for(let i = 0; i < recDetList.length; i++) {
        if(recDetList[i].drugId === item.id) cnt++;
      }
      return cnt;
    }
    
    const formatDate = (date) => {
        const day = getWeekStartAndEnd(date);
        return {
            start: day.start.date(),
            ms: day.start.month() + 1,
            ys: day.start.year(),
            end: day.end.date(),
            me: day.end.month() + 1,
            ye: day.end.year(),
            month: date.month() + 1,
            year: date.year()
        }
    }
    const displayTime = (date) => {
        const time = formatDate(date);
            return time.start + '/' + time.ms + '/' + time.ys + ' - ' + time.end + '/' + time.me + '/' + time.ye;
    }
    const isLeapYear = (year) => {
        if (year % 4 !== 0) {
          return false;
        } else if (year % 100 === 0 && year % 400 !== 0) {
          return false;
        } else {
          return true;
        }
    }
    const getDayofMonth = (month, year) => {
        if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) return 31;
        if(month === 2) {
            if(isLeapYear(year)) return 29;
            return 28;
        }
        return 30;
    }
    const StringToDate = (str) => {
      if(str != null)
      {
          const date = new Date(str);
          return {
              day: date.getDate(),
              month: date.getMonth() + 1,
              year: date.getFullYear(),
          }; 
      }
      return null;
  }
    const getLabelForChartWeek = (time) => {
        let arr = [];
        const date = formatDate(time);
        if(date.start < date.end) {
            for(let i = date.start; i <= date.end; i++)
                arr.push(i + '/' + date.month);
        }
        else {
            for(let i = date.start; i <= getDayofMonth(date.ms, date.ys); i++)
                arr.push(i + '/' + date.ms);
            for(let i = 1; i <= date.end; i++)
                arr.push(i + '/' + date.me);
        }
        return arr;
    }
    
    const getDataNewForChartWeek = (time, item) => {
      const date = formatDate(time);
      let newData = [];
      if(date.start < date.end) {
        for(let i = date.start; i <= date.end; i++)
        {
          let arrApt = [];
          let count = 0;
          for(let j = 0; j < aptList.length; j++) {
            const tmp = StringToDate(aptList[j].scheduleDate);
            if(tmp.day === i && tmp.month === date.month && tmp.year === date.year)
              arrApt.push(aptList[j].id)
          }
          let arrRec = [];
          for(let j = 0; j < recList.length; j++) {
            if(arrApt.includes(recList[j].appointmentListId))
              arrRec.push(recList[j].id);
          }
          console.log(i + ": " + arrRec);
          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
              if(recDetList[j].drugId === item.id) {
                console.log("detail: " + recDetList.count);
                count = count + recDetList[j].count;
              }
            }
          }
          newData.push(count);
        }
      }
      else {
        for(let i = date.start; i <= getDayofMonth(date.ms, date.ys); i++)
        {
          let arrApt = [];
          let count = 0;
          for(let j = 0; j < aptList.length; j++) {
            const tmp = StringToDate(aptList[j].scheduleDate);
            if(tmp.day === i && tmp.month === date.ms && tmp.year === date.ye)
              arrApt.push(aptList[j].id)
          }
          let arrRec = [];
          for(let j = 0; j < recList.length; j++) {
            if(arrApt.includes(recList[j].id))
              arrRec.push(recList[j].id);
          }
          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].id)) {
              if(recDetList[j].drugId === item.id) {
                count = count + recDetList[j].count;
              }
            }
          }
          newData.push(count);
        }
        for(let i = 1; i <= date.end; i++)
        {
          let arrApt = [];
          let count = 0;
          for(let j = 0; j < aptList.length; j++) {
            const tmp = StringToDate(aptList[j].scheduleDate);
            if(tmp.day === i && tmp.month === date.me && tmp.year === date.ye)
              arrApt.push(aptList[j].id)
          }
          let arrRec = [];
          for(let j = 0; j < recList.length; j++) {
            if(arrApt.includes(recList[j].id))
              arrRec.push(recList[j].id);
          }
          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].id)) {
              if(recDetList[j].drugId === item.id) {
                count = count + recDetList[j].count;
              }
            }
          }
          newData.push(count);
        }
      }  
      return newData;
    }
    const getDataForChartWeek = (date, item) => {
        let tmp = chartData;
        tmp.labels = getLabelForChartWeek(date);
        const tmp2 = getDataNewForChartWeek(date, item);
        console.log(tmp2);
        tmp.datasets = [
            {
              label: 'Số lượng bán ra',
                data: tmp2, 
                backgroundColor: 'red',
                borderWidth: 1,
                barThickness: 30,
                borderRadius: 2,
            },
        ]
        setChartData(tmp);
    }
    const [chartData, setChartData] = useState(
        {
            labels: [1,1,1,1,1,1,1], // Replace with your category labels
            datasets: [
                {label: 'Số lượng bán ra',
                    data: [0,0,0,0,0,0,0], // Replace with your variable 2 data
                    backgroundColor: 'red',
                    borderWidth: 1,
                    barThickness: 25,
                    borderRadius: 2,
                },
            ],
        }
    );

    const optionschart = {
        title: {
            display: true,
            text: 'Biểu đồ doanh thu 2 cột'
          },
        scales: {
            y: {
                ticks: {
                    maxTicksLimit: 5,
                },
            },
        },
        plugins: {
            legend: {
                display: true, // Ẩn chú thích màu
            },
        },
        elements: {
            bar: {
                barThickness: 50, // Độ dày của cột màu
            },
        },
    };
    

    return ( 
    
    <div className="d-flex flex-row w-100">
        <div className="col-md-8">
            <Card>
            <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "23%" }}>
                Tên
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "23%" }}>
                Số lượng tồn kho
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Giá
              </div>
              <div className="text-start" style={{ width: "14%" }}>
                Số lần dùng
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {listState &&
                listState.map((drug, index) => {
                  return (
                      <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={index}
                    >
                          
                          <div
                            className="text-start"
                            style={{ width: "23%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {drug.drugName}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "15%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {getUnitName({ id: drug.unitId })}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "23%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {drug.count}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "20%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {drug.price}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "15%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                              {countDrugInRecord(drug)}
                          </div>
                          <div
                            className="text-end"
                            style={{ width: "4%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                                <FontAwesomeIcon onClick={() =>
                                  setDetailItem(drug)
                                } className='icon-view' icon={faEye} />
                          </div>
                          {/* <ul className="dropdown-menu">
                            <li className="dropdown-item">
                              <span
                                onClick={() =>
                                  setDetailItem(drug)
                                }
                              >
                                Xem chi tiết
                              </span>
                            </li>
                          </ul> */}
                      </li>
                  );
                })}
            </TableBody>
          </div>
            </Card>
        </div> 
        <div className="col-md-4">
            <Card>
                <div className='d-flex flex-column align-items-center h-100'>
                  <div className="detail-header">
                    <p>{selectItem.drugName || "Tên thuốc"}</p>
                  </div>
                  
                  <div className='detail-chart'>
                  <div className='select-box-1' >
                        <div className='combobox' onClick={() => handleOpenCalendar(!isOpenCalendar)}>
                            <p>{displayTime(valueTime)}</p>
                            <div className='icon'>
                                <FontAwesomeIcon className='icon' icon={faCaretDown} />
                            </div>
                        </div>
                        {isOpenCalendar &&
                            <div className='calendar'>
                                <SelectTime setNewTime={setNewTime} value={valueTime}></SelectTime>
                            </div>
                        }
                    </div>
                      <Bar data={chartData} options={optionschart}></Bar>
                  </div>
                  <div className='detail-item'>
                    <p>Đơn vị: {getUnitName({ id: selectItem.unitId })}</p>
                  </div>
                  <div className='detail-item'>
                    <p>Giá bán: {selectItem.price}</p>
                  </div>
                  <div className='detail-item'>
                    <p>Số lượng tồn kho: {selectItem.count}</p>
                  </div>
                  <div className='detail-item'>
                    <p>Ghi chú:</p>
                    <div className='note-content'>
                        <p>{selectItem.note}</p>
                    </div>
                  </div>
                </div>
            </Card>
        </div>
    </div>
    
    );
}

export default Medicine;