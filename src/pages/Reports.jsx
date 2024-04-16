import styles from './Reports.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Revenue from './report/Revenue/Revenue';
import Report from './report/Medicine/Medicine';
const cx = classNames.bind(styles);

function ReportsPage() {
    const [page, setPage] = useState(0);
    const handleSetPage = (newpage) => {
        setPage(newpage);
    };
    return (
        <div className={cx('content')}>
            <div className={cx('header')}>
                {page != 0 ? (
                    <label
                        className={cx('payment')}
                        style={{ color: 'rgb(118, 116, 116)' }}
                        onClick={() => handleSetPage(0)}
                    >
                        Doanh thu
                    </label>
                ) : (
                    <label className={cx('payment')} style={{ color: 'black' }}>
                        Doanh thu
                    </label>
                )}
                {page != 1 ? (
                    <label
                        className={cx('medicine')}
                        style={{ color: 'rgb(118, 116, 116)' }}
                        onClick={() => handleSetPage(1)}
                    >
                        Báo cáo
                    </label>
                ) : (
                    <label className={cx('medicine')} style={{ color: 'black' }}>
                        Báo cáo
                    </label>
                )}
                
            </div>
            <div className={cx('body')}>
                {page === 0 ? <Revenue></Revenue> : <Report></Report> }
            </div>
        </div>
    );
}

export default ReportsPage;
