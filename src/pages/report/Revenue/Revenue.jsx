import * as React from 'react';
import dayjs from 'dayjs';
import Card from '../../../components/Card'
import './Revenue.scss'
import { Bar, Line } from 'react-chartjs-2';
import SelectTime from '../../../components/SelectTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { faCaretDown, faChartSimple } from '@fortawesome/free-solid-svg-icons';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function Revenue() {
    const data = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // Replace with your category labels
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 20], // Replace with your variable 1 data
                backgroundColor: 'blue',
                borderWidth: 1,
                barThickness: 30,
                borderRadius: 2,
            },
            {
                data: [0, 0, 0, 0, 0, 0, 8], // Replace with your variable 2 data
                backgroundColor: 'red',
                borderWidth: 1,
                barThickness: 30,
                borderRadius: 2,
            },
        ],
    };

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
                display: false, // Ẩn chú thích màu
            },
        },
        elements: {
            bar: {
                barThickness: 50, // Độ dày của cột màu
            },
        },
    };
    const [value, setValue] = React.useState(dayjs('2022-04-17'));
    const setNewTime = (value) => {
        setValue(value);
        console.log(getWeekStartAndEnd(value).start.date() + " " + getWeekStartAndEnd(value).end.date());
    }
    const getWeekStartAndEnd = (selectedDay) => {
        const startOfWeek = selectedDay.startOf('week');
        const endOfWeek = startOfWeek.add(6, 'days');
        return { start: startOfWeek, end: endOfWeek };
    };
    const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);
    const handleOpenCalendar = (value) => {
        setIsOpenCalendar(value);
        console.log(isOpenCalendar);
    }
    return ( <Card>
        <div className="position-relative">
            <div className="d-flex">
                <div className="d-flex justify-content-start">
                    <div className='select-box' >
                        <div className='combobox' onClick={() => handleOpenCalendar(!isOpenCalendar)}>
                            <p>Chon ngay</p>
                            <div className='icon'>
                                <FontAwesomeIcon className='icon' icon={faCaretDown} />
                            </div>
                        </div>
                        {isOpenCalendar &&
                            <div className='calendar'>
                                <SelectTime setNewTime={setNewTime} value={value}></SelectTime>
                            </div>
                        }
                    </div>
                    <div className='select-box' style={{marginLeft: '10px'}}>
                        <div className='combobox' onClick={() => handleOpenCalendar(!isOpenCalendar)}>
                            <p>Tháng</p>
                            <div className='icon'>
                                <FontAwesomeIcon className='icon' icon={faCaretDown} />
                            </div>
                        </div>
                        {isOpenCalendar &&
                            <div className='calendar'>
                                <SelectTime setNewTime={setNewTime} value={value}></SelectTime>
                            </div>
                        }
                    </div>
                </div>
                <div className="position-absolute top-20 end-0">
                    <FontAwesomeIcon className='icon' icon={faChartSimple} />
                </div>
            </div>
        </div>
        {/* <Bar data={data} options={optionschart} /> */}
        
    </Card> );
}

export default Revenue;