import { combineReducers } from 'redux';
import campaignReducer from './CampaignModule'
import reviewReducer from './ReviewModule';
import donationReducer from './DonationModule';
import {exchangeReducer, modalReducer} from './PointModule';
import memberReducer from './MemberModule';

const rootReducer = combineReducers({
    campaignReducer,
    reviewReducer,
    donationReducer,
    exchangeReducer,
    modalReducer,
    memberReducer
});

export default rootReducer;