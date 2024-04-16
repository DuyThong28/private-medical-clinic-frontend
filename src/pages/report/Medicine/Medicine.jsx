import Card from '../../../components/Card'
import TableHeader from '../../../components/TableHeader';
import TableBody from '../../../components/TableBody';
import { useRef, useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import './Medicine.scss'
import { fetchAllDrugs } from '../../../services/drugs'
import { fetchUnitById} from '../../../services/units'
import Chart from 'chart.js/auto';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

function Medicine() {

  const drugsQuery = useQuery({
    queryKey: ["druglist"],
    queryFn: () => {
      return fetchAllDrugs({ });
    },
  });

  const drugs = drugsQuery.data;

    const dataline = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // Replace with your category labels
        datasets: [
            {
                data: [0, 0, 0, -10, 0, 45, 40],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4, // Đặt độ cong của đường nối ở đây
                fill: true,
            },
        ],
    };

    // Cấu hình biểu đồ
    const optionsline = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                },
            },
        },
    };
    const [selectItem, setSelectItem] = useState({});
    const setDetailItem = (item) => {
        setSelectItem(item);
    }
    const unitState = useSelector((state) => state.unit);
    function getUnitName({ id }) {
      const res = unitState.filter((unit) => unit.id === id)[0];
      return res?.unitName;
    }

    return ( 
    
    <div className="d-flex flex-row w-100">
        <div className="col-md-8">
            <Card>
            <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "25%" }}>
                Tên
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "25%" }}>
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
              {drugs &&
                drugs.map((drug, index) => {
                  return (
                      <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={index}
                    >
                          
                          <div
                            className="text-start"
                            style={{ width: "25%" }}
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
                            style={{ width: "25%" }}
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
                              2
                          </div>
                          <ul className="dropdown-menu">
                            <li className="dropdown-item">
                              <span
                                onClick={() =>
                                  setDetailItem(drug)
                                }
                              >
                                Xem chi tiết
                              </span>
                            </li>
                          </ul>
                      </li>
                  );
                })}
            </TableBody>
          </div>
            </Card>
        </div> 
        <div className="col-md-4">
            <Card>
                <div className='d-flex flex-column align-items-center'>
                  <div className="detail-header">
                    <p>{selectItem.drugName}</p>
                  </div>
                  <div className='detail-chart'>
                      <Line data={dataline} options={optionsline}></Line>
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
                        <p>Nội dung ghi chú.</p>
                    </div>
                  </div>
                </div>
            </Card>
        </div>
    </div>
    
    );
}

export default Medicine;