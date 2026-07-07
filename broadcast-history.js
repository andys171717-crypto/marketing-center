/* ==========================================
   BROADCAST HISTORY
   VERSION 1.0
========================================== */

let histories = [];

/* ==========================================
   ADD HISTORY
========================================== */

export function addHistory(history){

    histories.push({

        id:
        crypto.randomUUID(),

        campaignId:
        history.campaignId ||

        "",

        timelineId:
        history.timelineId ||

        "",

        templateId:
        history.templateId ||

        "",

        phone:
        history.phone ||

        "",

        contactName:
        history.contactName ||

        "",

        status:
        history.status ||

        "WAITING",

        reasonCode:
        history.reasonCode ||

        "",

        apiDuration:
        history.apiDuration ||

        0,

        humanDelay:
        history.humanDelay ||

        0,

        createdAt:
        Date.now()

    });

}

/* ==========================================
   GET ALL
========================================== */

export function getHistories(){

    return histories;

}

/* ==========================================
   CLEAR
========================================== */

export function clearHistories(){

    histories=[];

}
