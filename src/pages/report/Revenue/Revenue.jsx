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
    const [value, setValue] = React.useState(dayjs());
    const setNewTime = (value) => {
        setValue(value);
        console.log(formatDate(value));
    }
    const getWeekStartAndEnd = (selectedDay) => {
        const startOfWeek = selectedDay.startOf('week');
        const endOfWeek = startOfWeek.add(6, 'days');
        return { start: startOfWeek, end: endOfWeek };
    };
    const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);
    const handleOpenCalendar = (value) => {
        setIsOpenCalendar(value);
        setIsOpenTimeOption(false);
        console.log(isOpenCalendar);
    }
    const [isOpenTimeOption, setIsOpenTimeOption] = React.useState(false);
    const handleOpenTimeOption = (value) => {
        setIsOpenCalendar(false);
        setIsOpenTimeOption(value);
    }
    const [timeOption, setTimeOption] = React.useState('Tuần');
    const handleSetTimeOption = (value) => {
        setTimeOption(value);
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
        if(timeOption == 'Tuần') {
            return time.start + '/' + time.ms + '/' + time.ys + ' - ' + time.end + '/' + time.me + '/' + time.ye;
        }
        if(timeOption == 'Tháng') {
            return 'Tháng ' + time.month + ' ' + time.year; 
        }
        if(timeOption == 'Năm') {
            return time.year; 
        }
    }
    return ( <Card>
        <div className="position-relative">
            <div className="d-flex">
                <div className="d-flex justify-content-start">
                    <div className='select-box-1' >
                        <div className='combobox' onClick={() => handleOpenCalendar(!isOpenCalendar)}>
                            <p>{displayTime(value)}</p>
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
                    <div className='select-box-2' style={{marginLeft: '10px'}}>
                        <div className='combobox' onClick={() => handleOpenTimeOption(!isOpenTimeOption)}>
                            <p>{timeOption}</p>
                            <div className='icon'>
                                <FontAwesomeIcon className='icon' icon={faCaretDown} />
                            </div>
                        </div>
                        {isOpenTimeOption &&
                            <div className='select-time' >
                                <div className='item' onClick={() => {handleSetTimeOption('Tuần');  handleOpenTimeOption(false)}}>
                                    <p>Tuần</p>
                                </div>
                                <div className='item' onClick={() => {handleSetTimeOption('Tháng');  handleOpenTimeOption(false)}}>
                                    <p>Tháng</p>
                                </div>
                                <div className='item' onClick={() => {handleSetTimeOption('Năm');  handleOpenTimeOption(false)}}>
                                    <p>Năm</p>
                                </div>
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