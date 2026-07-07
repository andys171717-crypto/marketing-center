/* ==========================================
   BROADCAST QUEUE
   VERSION 1.0
========================================== */

let queues=[];

/* ==========================================
   CLEAR
========================================== */

export function clearQueue(){

    queues=[];

}

/* ==========================================
   GET
========================================== */

export function getQueue(){

    return queues;

}

/* ==========================================
   TOTAL
========================================== */

export function getQueueCount(){

    return queues.length;

}

/* ==========================================
   ADD
========================================== */

export function addQueue(

    job

){

    queues.push({

        id:
        crypto.randomUUID(),

        campaignId:
        job.campaignId ||

        "",

        timelineId:
        job.timelineId ||

        "",

        templateId:
        job.templateId ||

        "",

        phone:
        job.phone ||

        "",

        contactName:
        job.contactName ||

        "",

        schedule:
        job.schedule ||

        "",

        status:
        "WAITING",

        createdAt:
        Date.now()

    });

}

/* ==========================================
   NEXT JOB
========================================== */

export function nextQueueJob(){

    const job = queues.find(

        item =>

        item.status==="WAITING"

    );

    if(!job){

        return null;

    }

    job.status = "PROCESSING";

    return job;

}

/* ==========================================
   UPDATE STATUS
========================================== */

export function updateQueueStatus(

    id,

    status

){

    const job=

    queues.find(

        item=>

        item.id===id

    );

    if(job){

        job.status=status;

    }

}
