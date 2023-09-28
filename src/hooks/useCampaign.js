import { useState, useEffect } from 'react';
import { useConnection } from '../context/connection';
import abi from '../constants/abi.json';
import { ethers } from 'ethers';
import { contractAddress } from '../constants';

const useCampaign = () => {
  const { provider } = useConnection();
  const [campaignList, setCampaignList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaigns = [];
        const campaignContract = new ethers.Contract(
          contractAddress,
          abi,
          provider
        );
        const id = await campaignContract.id();
        for (let i = 1; i <= id; i++) {
          const campaign =  campaignContract.crowd(i);
          campaigns.push(campaign);
        }

        const campaignArray = await Promise.all(campaigns);
        const campaignList = campaignArray.map((campaign) => ({
          title: campaign.title,
          fundingGoal: ethers.formatEther(campaign.fundingGoal),
          owner: campaign.owner,
          durationTime: ethers.formatUnits(campaign.durationTime, 0),
          isActive: campaign.isActive,
          fundingBalance: ethers.formatEther(campaign.fundingBalance),
        }));

        setCampaignList(campaignList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [provider]);
  return campaignList;
};

export default useCampaign;
