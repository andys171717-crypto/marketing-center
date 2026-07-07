/* ==========================================
   CAMPAIGN MANAGER
   VERSION 1.0
========================================== */

/* ==========================================
   DATA
========================================== */

let campaigns = [];

let activeCampaignId = null;

/* ==========================================
   CREATE CAMPAIGN
========================================== */

export function createCampaign(name){

    const campaign = {

        id:
        crypto.randomUUID(),

        name:
        name,

        status:
        "draft",

        createdAt:
        Date.now(),

        timelines:[]

    };

    campaigns.push(campaign);

    activeCampaignId =
    campaign.id;

    return campaign;

}

/* ==========================================
   GET ALL
========================================== */

export function getCampaigns(){

    return campaigns;

}

/* ==========================================
   GET ACTIVE
========================================== */

export function getActiveCampaign(){

    return campaigns.find(

        item =>

        item.id===activeCampaignId

    );

}

/* ==========================================
   SET ACTIVE
========================================== */

export function setActiveCampaign(id){

    activeCampaignId = id;

}

/* ==========================================
   DELETE
========================================== */

export function deleteCampaign(id){

    campaigns = campaigns.filter(

        item =>

        item.id!==id

    );

    if(activeCampaignId===id){

        activeCampaignId=null;

    }

}

/* ==========================================
   RENAME
========================================== */

export function renameCampaign(

    id,

    newName

){

    const campaign =

    campaigns.find(

        item=>item.id===id

    );

    if(campaign){

        campaign.name=newName;

    }

}

/* ==========================================
   ADD TIMELINE
========================================== */

export function addTimeline(

    campaignId,

    timeline

){

    const campaign =

    campaigns.find(

        item=>item.id===campaignId

    );

    if(!campaign){

        return null;

    }

    const newTimeline={

        id:
        crypto.randomUUID(),

        name:
        timeline.name ||

        "Timeline",

        schedule:
        timeline.schedule ||

        "",

        enabled:
        true,

        templates:
        timeline.templates ||

        [],

        settings:{

            minDelay:
            timeline.settings?.minDelay ?? 5,

            maxDelay:
            timeline.settings?.maxDelay ?? 20,

            batchSize:
            timeline.settings?.batchSize ?? 20,

            batchDelay:
            timeline.settings?.batchDelay ?? 180

        }

    };

    campaign.timelines.push(

        newTimeline

    );

    return newTimeline;

}

/* ==========================================
   UPDATE TIMELINE
========================================== */

export function updateTimeline(

    campaignId,

    timelineId,

    data

){

    const campaign =

    campaigns.find(

        item=>item.id===campaignId

    );

    if(!campaign){

        return false;

    }

    const timeline =

    campaign.timelines.find(

        item=>item.id===timelineId

    );

    if(!timeline){

        return false;

    }

    Object.assign(

        timeline,

        data

    );

    return true;

}

/* ==========================================
   DELETE TIMELINE
========================================== */

export function deleteTimeline(

    campaignId,

    timelineId

){

    const campaign =

    campaigns.find(

        item=>item.id===campaignId

    );

    if(!campaign){

        return false;

    }

    campaign.timelines =

    campaign.timelines.filter(

        item=>item.id!==timelineId

    );

    return true;

}

/* ==========================================
   MOVE TIMELINE UP
========================================== */

export function moveTimelineUp(

    campaignId,

    timelineId

){

    const campaign =

    campaigns.find(

        item=>item.id===campaignId

    );

    if(!campaign){

        return false;

    }

    const index =

    campaign.timelines.findIndex(

        item=>item.id===timelineId

    );

    if(index<=0){

        return false;

    }

    [

        campaign.timelines[index-1],

        campaign.timelines[index]

    ]=[

        campaign.timelines[index],

        campaign.timelines[index-1]

    ];

    return true;

}

/* ==========================================
   MOVE TIMELINE DOWN
========================================== */

export function moveTimelineDown(

    campaignId,

    timelineId

){

    const campaign =

    campaigns.find(

        item=>item.id===campaignId

    );

    if(!campaign){

        return false;

    }

    const index =

    campaign.timelines.findIndex(

        item=>item.id===timelineId

    );

    if(

        index===-1 ||

        index===campaign.timelines.length-1

    ){

        return false;

    }

    [

        campaign.timelines[index],

        campaign.timelines[index+1]

    ]=[

        campaign.timelines[index+1],

        campaign.timelines[index]

    ];

    return true;

}

/* ==========================================
   ENABLE / DISABLE TIMELINE
========================================== */

export function enableTimeline(

    campaignId,

    timelineId

){

    return updateTimeline(

        campaignId,

        timelineId,

        {

            enabled:true

        }

    );

}

export function disableTimeline(

    campaignId,

    timelineId

){

    return updateTimeline(

        campaignId,

        timelineId,

        {

            enabled:false

        }

    );

}

