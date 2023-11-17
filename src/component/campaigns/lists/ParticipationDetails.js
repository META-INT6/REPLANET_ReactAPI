//참여내역 리스ㅡㅌ

import { useSelector, useDispatch } from "react-redux";
import Participation from "../items/Participation";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetDonationByCampaignCodeAPI } from "../../../apis/DonationAPI";

function ParticipationDetails({ campaignInfo }) {
    const participation = useSelector(state => state.donationReducer);
    const [participations, setParticipations] = useState();
    const campaignCode = useParams();
    const dispatch = useDispatch();
    const itemsPerPage = 10;

    const pageInfo = participation;

    const [start, setStart] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageEnd, setPageEnd] = useState(1)

    const pageNumber = [];
    if(pageInfo){
        for(let i = 1; i <= pageInfo.pageEnd ; i++){
            pageNumber.push(i);
        }
    }
    useEffect(
        () => {
            setStart((currentPage - 1) * 5);
            dispatch(callGetDonationByCampaignCodeAPI({	
                campaignCode: campaignCode.campaignCode,
                currentPage: currentPage
            }));            
        }
        ,[dispatch]
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = participation && participation.length > 0 ? participation.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalItems = participation.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
// participation.map(participation => <Participation key={participation.donationCode}  participation={participation}/>

    return (
        participation&&(
        <>
            <h2 style={{ textAlign: "center" }}>참여 내역 </h2>
            {participation && participation.length > 0 ? (currentItems.map( (participation) => (
                <Participation key={participation.donationCode}  participation={participation}/>

            ))):(
                <tr>
                    <td colSpan={5}>참여내역이 없습니다!</td>
                </tr>
            )}
                
           

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
        </>
        )
    );
}

export default ParticipationDetails;







