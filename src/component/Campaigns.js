import React from 'react'
import  useCampaign  from '../hooks/useCampaign';

const Campaigns = () => {

    const  campaignList  = useCampaign();
  return (
    <div className='flex justify-center'>
        <ul>
                {campaignList.map((campaign, index) => (
                    <li className='mt-10' key={index}>
                        <strong>Title:</strong> {campaign.title}<br />
                        <strong>Funding Goal:</strong> {campaign.fundingGoal}<br />
                        <strong>Owner:</strong> {campaign.owner}<br />
                        <strong>Duration Time:</strong> {campaign.durationTime}<br />
                        <strong>Is Active:</strong> {campaign.isActive ? 'Yes' : 'No'}<br />
                        <strong>Funding Balance:</strong> {campaign.fundingBalance}
                    </li>
                ))}
            </ul>
    </div>
  )
}

export default Campaigns