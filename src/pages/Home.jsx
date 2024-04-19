import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchAllAppointmentListById} from '../services/appointmentList'
import {fetchPatientById} from '../services/patients'
import {fetchAllAppointmentListPatients} from '../services/appointmentListPatients'
import {fetchAllAppointmentRecordDetails} from '../services/appointmentRecordDetails'
import {fetchDrugById} from '../services/drugs'
import { useQuery } from '@tanstack/react-query';

import './Home.scss'
import { queryClient } from '../App';
import doctorImg from '../assets/doctor.png'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const optionschart = {
    scales: {
        y: {
            ticks: {
                maxTicksLimit: 3,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
    },
};

const css = `
        .my-today { 
            font-weight: bold;
            color: #d74f4a;
        }
    `;

function HomePage() {
    const getWeek = (day) => {
        const startOfWeek = new Date(day);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(day);
        endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 6);
        return {
            from: startOfWeek,
            to: endOfWeek,
        };
    };
    const preRange = useRef(getWeek(new Date()))
    const [range, setRange] = useState(() => getWeek(new Date()));
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isShowModal, setIsShowModal] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [selectedOption, setOptions] = useState("Week")

    const optionQuery = function (queryKey,optionFilter = (data)=>data){
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
                const searchData = optionFilter(finalData)
                return searchData;
            },
        }
    }

    const compareDate = (date1, date2) =>{
        const year1 = date1.getFullYear(); const month1 = date1.getMonth(); const day1 = date1.getDate();
        const year2 = date2.getFullYear(); const month2 = date2.getMonth(); const day2 = date2.getDate();

        if(year1 > year2){
            return 1
        } else if(year1 === year2 && month1 > month2){
            return 1
        } else if(year1 === year2 && month1 === month2 && day1 > day2){
            return 1
        } else if(year1 === year2 && month1 === month2 && day1 === day2){
            return 0
        }
        return -1
    }

    const getListAppointmentByToDay = (data)=>{
        const finalData = data.filter(
            (item)=> compareDate(new Date(item?.appointmentList.scheduleDate.slice(0, 10)), new Date()) === 0
        )
        return finalData
    }

    const getListAppointmentBySelectedDay = (data)=>{
        const finalData = data.filter(
            (item)=> compareDate(new Date(item?.appointmentList.scheduleDate.slice(0, 10)), selectedDay) === 0
        )
        return finalData
    }

    const getListAppointmentByWeek = (data)=>{
        const finalData = data.filter(
            (item)=> compareDate(new Date(item?.appointmentList.scheduleDate.slice(0, 10)), range.from) >= 0 && 
            compareDate(new Date(item?.appointmentList.scheduleDate), range.to) <= 0
        )
        return finalData
    }

    const getPreListAppointment = (data)=>{
        const finalData = data.filter(
            (item)=> compareDate(new Date(item?.appointmentList.scheduleDate.slice(0, 10)), new Date()) < 0
        )
        return finalData
    }

    const query = optionQuery("allAppointmentListPatients",getPreListAppointment)
    const query1 = optionQuery("appointmentListToday",getListAppointmentByToDay)
    const query2 = optionQuery("appointmentListSelectedDay",getListAppointmentBySelectedDay)
    const query3 = optionQuery("appointmentListWeek",getListAppointmentByWeek)

    const preAppointmentListPatientQuery = useQuery(query);
    const appointmentListPatientTodayQuery = useQuery(query1);
    const appointmentListPatientSelectedDayQuery = useQuery(query2);
    const appointmentListPatientWeekQuery = useQuery(query3);

    const appointmentListPatientToday = appointmentListPatientTodayQuery.data || []
    const appointmentListPatientSelectedDay = appointmentListPatientSelectedDayQuery.data || []
    const appointmentListPatientWeek = appointmentListPatientWeekQuery.data || []
    const preAppointmentListPatient = preAppointmentListPatientQuery.data || []

    
    const dataToday = (()=>{
        let newPatient = 0
        let oldPatient = 0
        for(const item of appointmentListPatientToday){
            const preAppointment =  preAppointmentListPatient.filter(
                appointment => appointment.patient?.id === item.patient?.id 
            )
            if(preAppointment.length>0){
                ++oldPatient
            }else{
                ++newPatient
            }
        }
        return {
            newPatient, oldPatient
        }
    })()

    const appointmentRecordDetailsQuery = useQuery({
        queryKey: ['appointmentRecordDetails'],
        queryFn: async () => {
            const data = await fetchAllAppointmentRecordDetails();
            // const finalData = await Promise.all(
            //     data.map(async (item) => {
            //         const drug = await fetchDrugById({ id: item.drugId });
            //         return {
            //             ...item,
            //             drug
            //         };
            //     })
            // );
            return data;
        },
    })

    const appointmentRecordDetails = appointmentRecordDetailsQuery.data || []
    console.log(appointmentRecordDetails);

    const [dataMale, setDataMale] = useState([])
    const [dataFemale, setDataFemale] = useState([])
    
    useEffect(()=>{
        const dataMale = []
        const dataFemale = []
        for(let i = 0;i < 7; ++i){
            const cloneDay = new Date(preRange.current.from)
            cloneDay.setDate(cloneDay.getDate() + i)
            const dayData = appointmentListPatientWeek.filter(
                item=>compareDate(new Date(item?.appointmentList?.scheduleDate.slice(0, 10)), cloneDay) === 0
            )
            dataMale.push(dayData.filter(item=>item?.patient?.gender === "Nam").length)
            dataFemale.push(dayData.filter(item=>item?.patient?.gender === "Nữ").length)
        }
        setDataMale(dataMale)
        setDataFemale(dataFemale)
    },[appointmentListPatientWeek])

    const dataOfChart = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                data: [...dataMale],
                backgroundColor: '#89d0ef',
                borderWidth: 1,
                barThickness: 10,
            },
            {
                data: [...dataFemale],
                backgroundColor: '#eb7474',
                borderWidth: 1,
                barThickness: 10,
            },
        ],
    }

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["appointmentListSelectedDay"] });
    }, [selectedDay]);

    
    //Medicines
    // const [medicines, setMedicines] = useState([
    //     {
    //         id: '2359834758493983945',
    //         tenThuoc: 'Thuốc đau đầu',
    //         tonKho: 50,
    //         banDuoc: 100,
    //         thanhTien: '100$',
    //     },
    //     {
    //         id: '23732848238992',
    //         tenThuoc: 'Thuốc ho',
    //         tonKho: 60,
    //         banDuoc: 120,
    //         thanhTien: '300$',
    //     },
    //     {
    //         id: '234812983912',
    //         tenThuoc: 'Thuốc tiêu hóa',
    //         tonKho: 70,
    //         banDuoc: 140,
    //         thanhTien: '200$',
    //     },
    //     {
    //         id: '329327595293',
    //         tenThuoc: 'Thuốc đau răng',
    //         tonKho: 80,
    //         banDuoc: 160,
    //         thanhTien: '50$',
    //     },
    //     {
    //         id: '2338959469845695',
    //         tenThuoc: 'Thuốc tránh thai',
    //         tonKho: 90,
    //         banDuoc: 180,
    //         thanhTien: '40$',
    //     },
    // ]);
    
    // Greeting

    useEffect(() => {
        const now = new Date();
        const formatDay = now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        const hour = now.getHours();

        if (hour < 12) {
            setGreeting('Good Morning! ' + formatDay);
        } else if (hour < 18) {
            setGreeting('Good Afternoon! ' + formatDay);
        } else {
            setGreeting('Good Evening! ' + formatDay);
        }
    }, []);

    const handleSelectedWeek = (day) => {
        setRange(() => {
            return getWeek(day);
        });
    };

    const toggleModal = ()=>{
        setIsShowModal(!isShowModal)
    }

    const handleShowChart = ()=>{
        queryClient.invalidateQueries({ queryKey: ["appointmentListWeek"] });
        setIsShowModal(!isShowModal)
        preRange.current = range
    }

    const selecWeek = ()=>{
        setOptions("Week")
    }
    const selecMonth = ()=>{
        setOptions("Month")
    }

    return (
      <>
        <div className='overview row'>
            <div className='col-9 pad-16'>
                <div className='overview-greeting '>
                    <img
                        src={doctorImg}
                        alt="Doctor"
                    />
                    <h1>{greeting}</h1>
                </div>
    
                <div className='overview-number'>
                    <div>
                        <h6>Patient of day</h6>
                        <h3 className='overview-number-patient'>{appointmentListPatientToday.length}</h3>
                    </div>
                    <div className='overview-number-percents'>
                        <div className='overview-number-percent'>
                            <p className='overview-number-typepatient'>New Patients</p>
                            <p>
                                {dataToday.newPatient}
                                <span className='overview-typepatient-percent new'>
                                    {(dataToday.newPatient/appointmentListPatientToday.length*100).toFixed(2) || 0}%
                                </span>
                            </p>
                        </div>
                        <div className='overview-number-percent'>
                            <p className='overview-number-typepatient'>Old Patients</p>
                            <p>
                                {dataToday.oldPatient}
                                <span className='overview-typepatient-percent old'>
                                    {(dataToday.oldPatient/appointmentListPatientToday.length*100).toFixed(2) || 0}%
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
    
                <div className='overview-patient-ofday '>
                    <h6>Number Of Patients</h6>
                    <div className='overview-patient-chart'>
                        <Bar data={dataOfChart} options={optionschart} width={600} className='overview-chart'/>
                        <div className='chart-note'>
                            <div className='note'>
                                <p className='male'>Male</p>
                            </div>
                            <div className='note'>
                                <p className='female'>Female</p>
                            </div>
                        </div>
                    </div>
                    <div className='weeks-selection'>
                        <label className="show-modal" onClick={toggleModal}>
                            Weeks
                            <FontAwesomeIcon className='weeks-icon' icon={faCaretDown}></FontAwesomeIcon>
                        </label>
                        <input id="toggle-modal" type="checkbox" checked={isShowModal}></input>
                        <div className='modal-calendar'>
                            <label className='modal-calendar-overlay' onClick={()=>{toggleModal();setRange(preRange.current)}}></label>
                            <div className='modal-calendar-content'>
                                <DayPicker
                                    defaultMonth={new Date()}
                                    selected={range}
                                    onDayClick={handleSelectedWeek}
                                    mode="range"
                                    showOutsideDays
                                />
                                <button className="btn-modal" onClick={handleShowChart}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className='overview-topmedicine '>
                    <h6>Top Medicines</h6>
                    <div className="dropdown-center selecweekormonth">
                        <p className="btn btn-secondary dropdown-toggle" style={{backgroundColor: "#13a1df", border: "none"}}  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedOption}
                        </p>

                        <ul className="dropdown-menu">
                            <li className={`dropdown-item ${selectedOption === "Week"?"active":""}`} onClick={selecWeek}>Week</li>
                            <li className={`dropdown-item ${selectedOption === "Month"?"active":""}`} onClick={selecMonth}>Month</li>
                        </ul>
                    </div>
                    <div className='table-responsive'>
                      <table className="table">
                          <thead>
                              <tr >
                                  <th scope="col" style={{color: "#13a1df"}}>ID</th>
                                  <th scope="col" style={{color: "#13a1df"}}>Tên Thuốc</th>
                                  <th scope="col" style={{color: "#13a1df"}}>Lượng tồn kho</th>
                                  <th scope="col" style={{color: "#13a1df"}}>Thuốc bán được</th>
                                  <th scope="col" style={{color: "#13a1df"}}>Thành tiền</th>
                              </tr>
                          </thead>
                          <tbody>
                              {
                                //   medicines.map((medicine, index)=>{
                                //       return (
                                //           <tr key={medicine.id} >
                                //               <th scope="row">{medicine.id}</th>
                                //               <td>{medicine.tenThuoc}</td>
                                //               <td>{medicine.tonKho}</td>
                                //               <td>{medicine.banDuoc}</td>
                                //               <td>{medicine.thanhTien}</td>
                                //           </tr>
                                //       )
                                //   })
                              }
                          </tbody>
                      </table>
                    </div>
                </div>
            </div>

            <div id="calendar" className='col-3'>
                <h6 className='calendar-title'>Calendar</h6>
                <style>{css}</style>
                <div className='calendar-container'>
                    <DayPicker
                        defaultMonth={new Date()}
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                        mode="single"
                        modifiersClassNames={{
                            today: 'my-today',
                        }}
                        showOutsideDays
                    ></DayPicker>
                </div>
                <h6 className="patients-of-day">Up comming</h6>
                <div className="patients-list">
                    {
                        appointmentListPatientSelectedDay.map((item)=>(                            
                            <div className="patient-item" key={item.id}>
                                <h6 className='patient-name'>{item.patient?.fullName}</h6>
                                <h6 className='gender'>Giới tính: {item.patient?.gender}</h6>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
      </>
    );
}
  
export default HomePage;
  