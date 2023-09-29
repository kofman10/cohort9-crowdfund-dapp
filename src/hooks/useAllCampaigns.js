import { useEffect, useState } from "react";
import useCampaignCount from "./useCampaignCount";
import { useConnection } from "../context/connection";
import {
    getCrowdfundContract,
    getCrowdfundContractWithProvider,
} from "../utils";

const useAllCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaign, setNewCampaign] = useState(null);
    const { provider } = useConnection();
    const campaignNo = useCampaignCount();
    
    useEffect(() => {
        const fetchAllCampaigns = async () => {
            try {
                const contract = await getCrowdfundContract(provider, false);
                const campaignsKeys = Array.from(
                    { length: Number(campaignNo) },
                    (_, i) => i + 1
                );
                const campaignPromises = campaignsKeys.map((id) =>
                    contract.crowd(id)
                );
                const campaignAddresses = campaignsKeys.map(id => contract.getContributors(id))
                
                const campaignResults = await Promise.all(campaignPromises);
                const campaignContributors = await Promise.all(campaignAddresses);

                const campaignDetails = campaignResults.map(
                    (details, index) => { 
                        const contributorAddresses = campaignContributors[index];
                        return {
                        id: campaignsKeys[index],
                        title: details.title,
                        fundingGoal: details.fundingGoal,
                        owner: details.owner,
                        durationTime: Number(details.durationTime),
                        isActive: details.isActive,
                        fundingBalance: details.fundingBalance,
                        contributors: contributorAddresses,
                    }
                }
                );
                console.log(newCampaign)
                if (newCampaign) {
                    campaignDetails.push(newCampaign);
                    setNewCampaign(null); 
                }

                setCampaigns(campaignDetails);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };


        fetchAllCampaigns();
        console.log(newCampaign)

        // Listen for event
        const handleProposeCampaignEvent = async (id, title, amount, duration) => {
            const newCampaignDetails = await contract.crowd(id);
         
            console.log(newCampaignDetails)
            setNewCampaign({
                id: id,
                title: title,
                fundingGoal: newCampaignDetails.fundingGoal,
                owner: newCampaignDetails.owner,
                durationTime: Number(newCampaignDetails.durationTime),
                isActive: newCampaignDetails.isActive,
                fundingBalance: newCampaignDetails.fundingBalance,
                contributors: [],
            });
        };
        const contract = getCrowdfundContractWithProvider(provider);
        contract.on("ProposeCampaign", handleProposeCampaignEvent);

        return () => {
            contract.off("ProposeCampaign", handleProposeCampaignEvent);
        };
    }, [campaignNo, provider, newCampaign]);

    return campaigns;
};

export default useAllCampaigns;
