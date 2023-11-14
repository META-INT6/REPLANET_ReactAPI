import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DonationItem from "../items/DonationItem";
import { callGetAllPaysByMemberWithDateAPI } from "../../../apis/DonationAPI";

function DonationList() {

    const result = useSelector(state => state.donationReducer);
    console.log('result', result);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    console.log('DonationList() startDate : ', startDate);
    console.log('DonationList() endDate : ', endDate);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const pays = result;
    console.log('DonationList() pays : ',pays);

    const handleSearch = () => {
        if (startDate && endDate) {
            console.log('DonationDetail() handleSearch() 실행 : 검색 버튼 누름');
            dispatch(callGetAllPaysByMemberWithDateAPI(startDate, endDate));
        }
    }

    const initSearchDate = () => {
        console.log('DonationDetail() initSearchDate() 실행 : 날짜 초기화됨');
        setStartDate('');
        setEndDate('');
    }

    const handleStartDateChange = (newStartDate) => {
        if (!endDate || new Date(newStartDate) <= new Date(endDate)) {
            setStartDate(newStartDate);
        } else {
            alert('검색 시작일자를 확인해주세요.');
        }
    };
    
    const handleEndDateChange = (newEndDate) => {
        if (!startDate || new Date(newEndDate) >= new Date(startDate)) {
            setEndDate(newEndDate);
        } else {
            alert('검색 종료일자를 확인해주세요.');
        }
    };

    const calculateTotalAmount = () => {
        return pays && pays.length > 0 ? (pays.reduce((total, pay) => total + pay.payAmount, 0)) : ('0');
    }

    useEffect(
        () => {
            console.log('DonationList() useEffect 실행');
                dispatch(callGetAllPaysByMemberWithDateAPI(startDate, endDate));
        },
        []
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pays && pays.length > 0 ? pays.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalItems = pays.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return(
            <>
            <div className="admin-main">
                <div className="admin-title">
                    <h5>기부내역</h5>
                </div>
                <div className='admin-title search-section'>
                    <div>
                        <input
                        type='date'
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className='button button-lg button-primary-outline' />
                        <span> ~ </span>
                        <input
                        type='date'
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className='button button-lg button-primary-outline' />
                    </div>
                    <div>
                        <button className='button button-lg button-primary-outline' onClick={initSearchDate}>
                            초기화
                        </button>
                        &nbsp;
                        <button className='button button-lg button-primary' onClick={handleSearch}>
                            검색
                        </button>
                    </div>
                </div>
                <div className='admin-title total-amount'>
                    <div>
                        <span>기간내 총 기부액 : </span>
                        <span className="pay-color-green">{calculateTotalAmount().toLocaleString()}원</span>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>순번</th>
                            <th>캠페인 이름</th>
                            <th>단체</th>
                            <th>기부금액</th>
                            <th>기부일자</th>
                        </tr>
                    </thead>
                    <tbody>
                    {pays && pays.length > 0 ? 
                        ( currentItems.map((pay) => (
                            <DonationItem key={pay.payCode} pay={pay} />
                        )))
                        :
                        (<tr><td colSpan={5}>기부내역이 없습니다!</td></tr>)}
                    </tbody>
                </table>

                <ul className="pagination">
                    <li className="icon" onClick={() => handlePageChange(currentPage -1)}><a><span className="fas fa-angle-left">&lt;</span></a></li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            <a className={currentPage === index + 1 ? "active" : ""}>
                                {index + 1}
                            </a>
                        </li>
                    ))}
                    <li onClick={() => handlePageChange(currentPage + 1)}><a><span className="fas fa-angle-left">&gt;</span></a></li>
                </ul>
            </div>
        </>
    );
}

export default DonationList;