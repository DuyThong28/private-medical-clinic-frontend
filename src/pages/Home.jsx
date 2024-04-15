import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import './Home.scss'

function HomePage() {
    //Medicines
    const medicines = [
        {
            id: '2359834758493983945',
            tenThuoc: 'Thuốc đau đầu',
            tonKho: 50,
            banDuoc: 100,
            thanhTien: '100$',
        },
        {
            id: '23732848238992',
            tenThuoc: 'Thuốc ho',
            tonKho: 60,
            banDuoc: 120,
            thanhTien: '300$',
        },
        {
            id: '234812983912',
            tenThuoc: 'Thuốc tiêu hóa',
            tonKho: 70,
            banDuoc: 140,
            thanhTien: '200$',
        },
        {
            id: '329327595293',
            tenThuoc: 'Thuốc đau răng',
            tonKho: 80,
            banDuoc: 160,
            thanhTien: '50$',
        },
        {
            id: '2338959469845695',
            tenThuoc: 'Thuốc tránh thai',
            tonKho: 90,
            banDuoc: 180,
            thanhTien: '40$',
        },
    ];
    // Greeting
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) {
            setGreeting('Good Morning!');
        } else if (hour < 18) {
            setGreeting('Good Afternoon!');
        } else {
            setGreeting('Good Evening!');
        }
    }, []);

    // Chart
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    const [data, setData] = useState({
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 10],
                backgroundColor: '#89d0ef',
                borderWidth: 1,
                barThickness: 10,
            },
            {
                data: [0, 0, 0, 0, 0, 0, 8],
                backgroundColor: '#eb7474',
                borderWidth: 1,
                barThickness: 10,
            },
        ],
    });

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
    // Calendar
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isShowModal, setIsShowModal] = useState(false)
    const css = `
        .my-today { 
            font-weight: bold;
            color: #d74f4a;
        }
    `;
    // Lấy week của day đang chọn
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
    const [range, setRange] = useState(() => getWeek(new Date()));
    const handleSelectedWeek = (day) => {
        setRange(() => {
            return getWeek(day);
        });
    };

    const toggleModal = ()=>{
        setIsShowModal(!isShowModal)
    }

    const handleShowChart = ()=>{
        setData((pre) => ({
                ...pre,
                datasets: [
                    { ...pre.datasets[0], data: [5, 5, 5, 5, 5, 5, 5] },
                    { ...pre.datasets[1], data: [7, 7, 7, 7, 7, 7, 7] },
                ],
            }));
        toggleModal()
    }

    // Format day
    const date = new Date()
    const formatDay = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    return (
      <>
        <div className='overview row'>
            <div className='col-9 pad-16'>
                <div className='overview-greeting '>
                    <img
                        src="https://static.wixstatic.com/media/c3c425_73e09c65cec240069ecb484238b84a39~mv2.png/v1/fill/w_540,h_498,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/shutterstock_1175753779%20copy_edited.png"
                        alt="Doctor"
                    />
                    <h1>{greeting} {formatDay}</h1>
                </div>
    
                <div className='overview-number'>
                    <div>
                        <caption>Patient of day</caption>
                        <h3 className='overview-number-patient'>40</h3>
                    </div>
                    <div className='overview-number-percents'>
                        <div className='overview-number-percent'>
                            <p className='overview-number-typepatient'>New Patients</p>
                            <p>
                                40<span className='overview-typepatient-percent new'>30%</span>
                            </p>
                        </div>
                        <div className='overview-number-percent'>
                            <p className='overview-number-typepatient'>Old Patients</p>
                            <p>
                                30<span className='overview-typepatient-percent old'>20%</span>
                            </p>
                        </div>
                    </div>
                </div>
    
                <div className='overview-patient-ofday '>
                    <caption>Number Of Patients</caption>
                    <div className='overview-patient-chart'>
                        <Bar data={data} options={optionschart} width={600} className='overview-chart'/>
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
                        <label for="toggle-modal" className="show-modal"  onClick={toggleModal}>
                            Weeks
                            <FontAwesomeIcon className='weeks-icon' icon={faCaretDown}></FontAwesomeIcon>
                        </label>
                        <input id="toggle-modal" type="checkbox" checked={isShowModal}></input>
                        <div className='modal-calendar'>
                            <label for="toggle-modal" className='modal-calendar-overlay' onClick={toggleModal}></label>
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
                    <caption>Top Medicines</caption>
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
                                  medicines.map((medicine, index)=>{
                                      return (
                                          <tr key={medicine.id} >
                                              <th scope="row">{medicine.id}</th>
                                              <td>{medicine.tenThuoc}</td>
                                              <td>{medicine.tonKho}</td>
                                              <td>{medicine.banDuoc}</td>
                                              <td>{medicine.thanhTien}</td>
                                          </tr>
                                      )
                                  })
                              }
                          </tbody>
                      </table>
                    </div>
                </div>
            </div>

            <div id="calendar" className='col-3'>
                <caption className='calendar-title'>Calendar</caption>
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
                <caption className="patients-of-day">Up comming</caption>
                <div className="patients-list">
                    <div className="patient-item">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/76/Sphynx_-_totte71.jpg"
                            alt="Avatar"
                        ></img>
                        <div>
                            <h6>Phạm Ngọc Thịnh</h6>
                            <h7 className='gender'>Giới tính: Nam</h7>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
}
  
export default HomePage;
  