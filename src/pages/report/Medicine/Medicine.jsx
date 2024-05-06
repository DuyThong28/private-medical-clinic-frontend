import Card from '../../../components/Card'
import TableHeader from '../../../components/TableHeader';
import TableBody from '../../../components/TableBody';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faCaretDown, faChartSimple, faEye, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import SelectTime from '../../../components/SelectTime';
import * as React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

let rememberWeek = dayjs();
let rememberMonth = dayjs();
let rememberYear = dayjs();
let rememberWeek2 = dayjs();
let rememberMonth2 = dayjs();
let rememberYear2 = dayjs();

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

    const countDrugInRecord = (month, year, item) => {
      let arrApt = [];
          let count = 0;
          for(let j = 0; j < aptList.length; j++) {
            const tmp = StringToDate(aptList[j].scheduleDate);
            if((month == -1 || tmp.month === month) && tmp.year === year)
              arrApt.push(aptList[j].id)
          }
          let arrRec = [];
          for(let j = 0; j < recList.length; j++) {
            if(arrApt.includes(recList[j].appointmentListId))
              arrRec.push(recList[j].id);
          }

          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
              if(recDetList[j].drugId === item.id) {
                count++;
              }
            }
          }
          return count;
    }
    
    const countDrugInRecordWeek = (time, item) => {
      let arrApt = [];
      let count = 0;
      const date = formatDate(time);
          if(date.ms != date.ms){
            for(let j = 0; j < aptList.length; j++) {
              const tmp = StringToDate(aptList[j].scheduleDate);
              if((tmp.month === date.ms && tmp.year === date.ys && tmp.day >= date.start) ||
                (tmp.month === date.me && tmp.year === date.ye && tmp.day <= date.end))
              arrApt.push(aptList[j].id)
            }
          }
          else {
            for(let j = 0; j < aptList.length; j++) {
              const tmp = StringToDate(aptList[j].scheduleDate);
              if(tmp.month === date.month && tmp.year === date.year && tmp.day >= date.start && tmp.day <= date.end)
                arrApt.push(aptList[j].id)
            }
          }
          let arrRec = [];
          for(let j = 0; j < recList.length; j++) {
            if(arrApt.includes(recList[j].appointmentListId))
              arrRec.push(recList[j].id);
          }

          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
              if(recDetList[j].drugId === item.id) {
                count++;
              }
            }
          }
          return count;
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
          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
              if(recDetList[j].drugId === item.id) {
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
            if(arrApt.includes(recList[j].appointmentListId))
              arrRec.push(recList[j].id);
          }

          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
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
            if(arrApt.includes(recList[j].appointmentListId))
              arrRec.push(recList[j].id);
          }
          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
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
        tmp.datasets = [
            {
              label: 'Số lượng bán ra',
                data: tmp2, 
                backgroundColor: '#3983fa',
                borderWidth: 1,
                barThickness: 10,
                borderRadius: 50,
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
                    backgroundColor: '#3983fa',
                    borderWidth: 1,
                    barThickness: 25,
                    borderRadius: 2,
                },
            ],
        }
    );

    const optionschart = {
        title: {
            display: false,
          },
        scales: {
            y: {
                ticks: {
                    maxTicksLimit: 5,
                    callback: function(value, index, values) {
                      return Number.isInteger(value) ? value : '';
                  }
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Ẩn chú thích màu
            },
        },
        elements: {
            bar: {
                barThickness: 50, // Độ dày của cột màu
            },
        },
    };
    /// Main Select Time:
    const [valueTime2, setValueTime2] = React.useState(dayjs());
    const setNewTime2 = (value) => {
        setValueTime2(value);
    }
    const [isOpenCalendar2, setIsOpenCalendar2] = React.useState(false);
    const handleOpenCalendar2 = (value) => {
        setIsOpenCalendar2(value);
        setIsOpenTimeOption2(false);
    }
    const [isOpenTimeOption2, setIsOpenTimeOption2] = React.useState(false);
    const handleOpenTimeOption2 = (value) => {
        setIsOpenCalendar2(false);
        setIsOpenTimeOption2(value);
        console.log(value);
    }
    const handlerSetNewTime2 = (value) => {
      setNewTime2(value);
      setIsOpenCalendar2(false);
    }
    const handlerSetNewTime = (value) => {
      setNewTime(value);
      setIsOpenCalendar(false);
    }
    const [timeOption2, setTimeOption2] = React.useState('Tháng');
    const handleSetTimeOption2 = (value) => {
      if(timeOption2 === "Tuần") rememberWeek2 = valueTime2;
      else if(timeOption2 === "Tháng") rememberMonth2 = valueTime2;
      else rememberYear2 = valueTime2;
      setTimeOption2(value);
      if(value === "Tuần") setValueTime2(rememberWeek2);
      else if(value === "Tháng") setValueTime2(rememberMonth2);
      else setValueTime2(rememberYear2);
    }
    const displayTime2 = (date) => {
      const time = formatDate(date);
      if(timeOption2 == "Tuần") return displayTime(date);
      if(timeOption2 == 'Tháng') {
              return 'Thg ' + time.month + ' ' + time.year;
      }
      if(timeOption2 == 'Năm') {
          return time.year; 
      }
  }
  const getCountInTime = (month, year, item) => {
          let arrApt = [];
          let count = 0;
          for(let j = 0; j < aptList.length; j++) {
            const tmp = StringToDate(aptList[j].scheduleDate);
            if((month == -1 || tmp.month === month) && tmp.year === year)
              arrApt.push(aptList[j].id)
          }
          let arrRec = [];
          for(let j = 0; j < recList.length; j++) {
            if(arrApt.includes(recList[j].appointmentListId))
              arrRec.push(recList[j].id);
          }

          for(let j = 0; j < recDetList.length; j++) {
            if(arrRec.includes(recDetList[j].appointmentRecordId)) {
              if(recDetList[j].drugId === item.id) {
                count = count + recDetList[j].count;
              }
            }
          }
          return count;
  }
  const getCountInTimeWeek = (time, item) => {
    let arrApt = [];
    let count = 0;
    const date = formatDate(time);
    if(date.ms != date.ms){
      for(let j = 0; j < aptList.length; j++) {
        const tmp = StringToDate(aptList[j].scheduleDate);
        if((tmp.month === date.ms && tmp.year === date.ys && tmp.day >= date.start) ||
          (tmp.month === date.me && tmp.year === date.ye && tmp.day <= date.end))
        arrApt.push(aptList[j].id)
      }
    }
    else {
      for(let j = 0; j < aptList.length; j++) {
        const tmp = StringToDate(aptList[j].scheduleDate);
        if(tmp.month === date.month && tmp.year === date.year && tmp.day >= date.start && tmp.day <= date.end)
          arrApt.push(aptList[j].id)
      }
    }
    
    let arrRec = [];
    for(let j = 0; j < recList.length; j++) {
      if(arrApt.includes(recList[j].appointmentListId))
        arrRec.push(recList[j].id);
    }

    for(let j = 0; j < recDetList.length; j++) {
      if(arrRec.includes(recDetList[j].appointmentRecordId)) {
        if(recDetList[j].drugId === item.id) {
          count = count + recDetList[j].count;
        }
      }
    }
    return count;
}
  const handleExportReport = () =>{
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bảng Báo Cáo');
   
    const date = formatDate(valueTime2);
    worksheet.mergeCells('A2:E2');
    const reportCell2 = worksheet.getCell('A2');
    if(timeOption2 === 'Tháng')
        reportCell2.value = 'Tháng: ' + date.month + '/' + date.year;
    else 
        reportCell2.value = 'Năm: ' + date.year;
    reportCell2.font = { bold: true };
    reportCell2.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getRow(3).values = ['STT', 'Thuốc', 'Đơn vị tính', 'Số lượng tồn kho', 'Số lần dùng'];
    const headerRow = worksheet.getRow(3);
    headerRow.values = ['STT', 'Thuốc', 'Đơn vị tính', 'Số lượng tồn kho', 'Số lần dùng'];
    headerRow.eachCell((cell) => {
    cell.font = { bold: true }; // Bold font
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCEEFF' } }; // Light blue background
    cell.alignment = { horizontal: "left" }; // Left alignment
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
    };
    });
    worksheet.columns = [
        { header: 'STT', key: 'STT', width: 5 },
        { header: 'Thuốc', key: 'thuoc', width: 20 },
        { header: 'Đơn vị tính', key: 'donVi', width: 15 },
        { header: 'Số lượng tồn kho', key: 'soLuong', width: 18 },
        { header: 'Số lần dùng', key: 'soLD', width: 15 },
    ];
    worksheet.mergeCells('A1:E1');
    const reportCell = worksheet.getCell('A1');
    reportCell.value = 'Báo Cáo Sử Dụng Thuốc Theo ' + timeOption2;
    reportCell.font = { bold: true };
    reportCell.alignment = { vertical: 'middle', horizontal: 'center' };
    
    let data = [];
    for (let i = 0; i < drugList.length; i++) {
      let sl;
      if(timeOption2 === 'Tháng') sl = getCountInTime(formatDate(valueTime2).month, formatDate(valueTime2).year, drugList[i]);
      else if(timeOption2 === 'Năm') sl = getCountInTime(-1, formatDate(valueTime2).year, drugList[i])
      else sl = getCountInTimeWeek(valueTime2, drugList[i])
      let sld;
      if(timeOption2 === 'Tháng') sld = countDrugInRecord(date.month, date.year, drugList[i]);
      else if(timeOption2 === 'Năm') sld = countDrugInRecord(-1, date.year, drugList[i]);
      else sld = countDrugInRecordWeek(valueTime2, drugList[i]);
        data.push({
            STT: i+1,
            thuoc: drugList[i].drugName,
            donVi: getUnitName({ id: drugList[i].unitId }),
            soLuong: sl,
            soLD: sld,
        })
    }
    data.forEach((row, rowIndex) => {
        const rowObject = worksheet.getRow(rowIndex + 4);
        rowObject.values = row;
        rowObject.eachCell((cell) => {
          cell.alignment = { horizontal: 'left' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
          };
        });
      });
    let nameExport;
    if(timeOption2 == 'Tháng') nameExport  = 'Bao_Cao_Su_Dung_Thuoc_Thang_' + date.month + '/' + date.year;
    else  nameExport  = 'Bao_Cao_Su_Dung_Thuoc_Nam_' + date.year;
    workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), nameExport + '.xlsx');
    });
  }

    return ( 
      
    <div className="d-flex flex-row w-100">
        <div className="col-md-8">
        
            <Card>
            <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <div className='row'>
              <div className="d-flex col-md-6 justify-content-start">
                      <div className='select-box-3' >
                          <div className='combobox' onClick={() => handleOpenCalendar2(!isOpenCalendar2)}>
                              <p>{displayTime2(valueTime2)}</p>
                              <div className='icon'>
                                  <FontAwesomeIcon className='icon' icon={faCaretDown} />
                              </div>
                          </div>
                          {isOpenCalendar2 &&
                              <div className='calendar'>
                                  <SelectTime setNewTime={setNewTime2} value={valueTime2} timeOption={timeOption2} handlerSetNewTime={handlerSetNewTime2}></SelectTime>
                              </div>
                          }
                      </div>
                      <div className='select-box-2' style={{marginLeft: '10px'}}>
                          <div className='combobox' onClick={() => handleOpenTimeOption2(!isOpenTimeOption2)}>
                              <p>{timeOption2}</p>
                              <div className='icon'>
                                  <FontAwesomeIcon className='icon' icon={faCaretDown} />
                              </div>
                          </div>
                          
                          {isOpenTimeOption2 &&
                              <div className='select-time' >
                                  <div className='item' onClick={() => {handleSetTimeOption2('Tuần');  handleOpenTimeOption2(false)}}>
                                      <p>Tuần</p>
                                  </div>
                                  <div className='item' onClick={() => {handleSetTimeOption2('Tháng');  handleOpenTimeOption2(false)}}>
                                      <p>Tháng</p>
                                  </div>
                                  <div className='item' onClick={() => {handleSetTimeOption2('Năm');  handleOpenTimeOption2(false)}}>
                                      <p>Năm</p>
                                  </div>
                              </div>
                          }
                      </div>
                      
                  </div>
                  <div className="d-flex col-md-6 justify-content-end">
                  <div className="export-button">
                <button onClick={handleExportReport}>
                    <FontAwesomeIcon className='icon-export' icon={faFileExcel} />
                    Export
                </button>
            </div>
                </div>
            </div>
            <TableHeader>
              <div className="text-start" style={{ width: "30%" }}>
                Tên
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "30%" }}>
                Số lượng sử dụng
              </div>
              <div className="text-start" style={{ width: "19%" }}>
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
                            style={{ width: "30%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {drug.drugName}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "20%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {getUnitName({ id: drug.unitId })}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "30%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {timeOption2 === 'Tuần' && getCountInTimeWeek(valueTime2, drug)}
                            {timeOption2 === 'Tháng' && getCountInTime(formatDate(valueTime2).month, formatDate(valueTime2).year, drug)}
                            {timeOption2 === 'Năm' && getCountInTime(-1, formatDate(valueTime2).year, drug)}
                          </div>
                          <div
                            className="text-start"
                            style={{ width: "16%" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                              {timeOption2 === 'Tháng' && countDrugInRecord(formatDate(valueTime2).month, formatDate(valueTime2).year, drug)}
                              {timeOption2 === 'Năm' && countDrugInRecord(-1, formatDate(valueTime2).year, drug)}
                              {timeOption2 === 'Tuần' && countDrugInRecordWeek(valueTime2,drug)}
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
                                <SelectTime setNewTime={setNewTime} value={valueTime} timeOption={"Tuần"} handlerSetNewTime={handlerSetNewTime}></SelectTime>
                            </div>
                        }
                    </div>
                      <Bar data={chartData} options={optionschart}></Bar>
                  </div>
                  <div className='detail-list'>
                  <div className='detail-item'>
                      <p>Tên thuốc: {selectItem.drugName}</p>
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
                      <p>Hoạt chất: {selectItem.note}</p>
                    </div>
                  </div>
                </div>
            </Card>
        </div>
    </div>
    
    );
}

export default Medicine;