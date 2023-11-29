import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { callGetTodayDonationAPI } from "../../../apis/DonationAPI";


function CountBox() {
  const participation = useSelector(state => state.donationReducer);
  const dispatch = useDispatch();
  let totalDonation = parseInt(participation[0]? participation[0].totalDonation: "0").toLocaleString('ko-KR');
  useEffect(
    () => {
      dispatch(callGetTodayDonationAPI());
    }
    , []
  );
  let getToday = new Date()
    let today = new Intl.DateTimeFormat('ko-KR', {
        month: 'long',
        day: 'numeric',
    }).format(getToday);

  return (
    participation && (
      <>
        <div style={{ marginTop: 100 }}>
          <div className="campaign-banner">
            <h3>{today} 하루,<br/>{participation[0] ? participation[0].donationCount : "0"}명의 사람들이 {totalDonation? totalDonation:""} 원만큼 모았어요! </h3>
          </div>
        </div>
        
      </>
    )
  );
}
export default CountBox;