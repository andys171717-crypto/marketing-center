/* ==========================================
   BROADCAST HISTORY
   VERSION 1.0
========================================== */

let histories = [];

let broadcastState = {

    campaign:"",

    template:"",

    message:"",

    waiting:[],

    sending:null,

    success:[],

    failed:[]

};

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

/* ==========================================
   BROADCAST STATE
========================================== */

export function getBroadcastState(){

    return broadcastState;

}

export function resetBroadcastState(){

    broadcastState = {

        campaign:"",

        template:"",

        message:"",

        waiting:[],

        sending:null,

        success:[],

        failed:[]

    };

}

export function setBroadcastInfo(

    campaign,

    template,

    message

){

    broadcastState.campaign = campaign;

    broadcastState.template = template;

    broadcastState.message = message;

}

export function setWaitingContacts(

    contacts

){

    broadcastState.waiting = [...contacts];

}

export function setSendingContact(

    contact

){

    broadcastState.sending = contact;

}

export function addSuccessContact(

    contact

){

    broadcastState.success.push(contact);

}

export function addFailedContact(

    contact

){

    broadcastState.failed.push(contact);

}

export function removeWaitingContact(

    phone

){

    broadcastState.waiting =

    broadcastState.waiting.filter(

        item =>

        !item.includes(`(${phone})`)

    );

}
