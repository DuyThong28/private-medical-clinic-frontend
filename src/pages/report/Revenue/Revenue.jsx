import Card from '../../../components/Card'
import './Revenue.scss'
import { Bar, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SelectTime from '../../../components/SelectTime';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
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

    return ( <Card>
        <div>
            <div class="d-flex justify-content-end">
                <FontAwesomeIcon className='icon' icon={faChartSimple} />
            </div>
        </div>
        <Bar data={data} options={optionschart} />
        {/* <SelectTime></SelectTime> */}
    </Card> );
}

export default Revenue;