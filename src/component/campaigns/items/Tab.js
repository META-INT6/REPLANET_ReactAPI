import { useDispatch, useSelector } from 'react-redux';
import { CampaignListAPI, CampaignListDoneAPI } from '../../../apis/CampaignListAPI';
import { getQueriesForElement } from '@testing-library/react';
import { useState } from 'react';


function Tab() {
    const dispatch = useDispatch();
    
    return (
        <div className='tabs'>
            <input id="tab1" type="radio" name="tab_item" checked onClick={() => dispatch(CampaignListAPI())}/>
            <label className="tab_item ti2" htmlFor="tab1">진행중인 캠페인</label>
            <input id="tab2" type="radio" name="tab_item"  onClick={() => dispatch(CampaignListDoneAPI())}/>
            <label className="tab_item ti2" htmlFor="tab2">완료된 캠페인</label>
        </div>
    );
}
export default Tab;