/* ==========================================
   BROADCAST RUNNER
   VERSION 1.0
========================================== */

import {

    nextQueueJob,

    updateQueueStatus

}

from "./broadcast-queue.js";

import {

    sendMessage

}

from "./ultramsg-sender.js";

import {

    addHistory

}

from "./broadcast-history.js";

import {

    addSuccess,

    addFailed

}

from "./broadcast-engine.js";

let runner={

    running:false,

    paused:false,

    stopped:false,

    currentJob:null,

    queueLength:0,

    processed:0

};

/* ==========================================
   GET RUNNER
========================================== */

export function getRunner(){

    return runner;

}

/* ==========================================
   RESET
========================================== */

export function resetRunner(){

    runner.running=false;

    runner.paused=false;

    runner.stopped=false;

    runner.currentJob=null;

    runner.queueLength=0;

    runner.processed=0;

}

/* ==========================================
   START
========================================== */

export function startRunner(

    queue

){

    resetRunner();

    runner.running=true;

    runner.queueLength=

    queue.length;

}

/* ==========================================
   PAUSE
========================================== */

export function pauseRunner(){

    runner.paused=true;

}

/* ==========================================
   RESUME
========================================== */

export function resumeRunner(){

    runner.paused=false;

}

/* ==========================================
   STOP
========================================== */

export function stopRunner(){

    runner.running=false;

    runner.stopped=true;

}

/* ==========================================
   SET CURRENT JOB
========================================== */

export function setCurrentJob(

    job

){

    runner.currentJob=job;

}

/* ==========================================
   NEXT
========================================== */

export function nextRunnerJob(){

    runner.processed++;

}

/* ==========================================
   COMPLETE
========================================== */

export function completeRunner(){

    runner.running = false;

    runner.stopped = false;

    runner.currentJob = null;

}

/* ==========================================
   PROGRESS
========================================== */

export function getRunnerProgress(){

    return {

        total:

        runner.queueLength,

        processed:

        runner.processed,

        remaining:

        Math.max(

            0,

            runner.queueLength -

            runner.processed

        ),

        percent:

        runner.queueLength===0

        ? 0

        : Math.round(

            (

                runner.processed /

                runner.queueLength

            ) * 100

        )

    };

}

/* ==========================================
   CURRENT JOB
========================================== */

export function hasCurrentJob(){

    return runner.currentJob!==null;

}

export function clearCurrentJob(){

    runner.currentJob=null;

}

/* ==========================================
   HUMAN DELAY
========================================== */

function sleep(

    seconds

){

    return new Promise(

        resolve =>

        setTimeout(

            resolve,

            seconds * 1000

        )

    );

}

function calculateAverageDelay(

    totalContacts,

    targetHours

){

    if(totalContacts <= 0){

        return 30;

    }

    // Campaign kecil
    if(totalContacts <= 10){

        return 30;

    }

    // Campaign menengah
    if(totalContacts <= 100){

        return 60;

    }

    // Campaign besar (contoh 500 kontak ≈ 5 jam)

    const totalSeconds =
    targetHours * 3600;

    let average =
    Math.floor(
        totalSeconds /
        totalContacts
    );

    average =
    Math.max(
        20,
        average
    );

    average =
    Math.min(
        120,
        average
    );

    return average;

}

/* ==========================================
   PROCESS ONE JOB
========================================== */

export async function processNextJob(

    context

){

    const job = nextQueueJob();

    if(!job){

        completeRunner();

        return null;

    }

    setCurrentJob(job);

window.dispatchEvent(

    new CustomEvent(

        "broadcast-progress",

        {

            detail:{

                status:"SENDING",

                campaign:job.campaignId,

                template:job.templateId,

                contact:job.contactName,

                phone:job.phone,

                message:job.message,

                processed:runner.processed,

                total:runner.queueLength

            }

        }

    )

);

let result;

try{

    result = await sendMessage(

        job.phone,

        job.message ??

        context.message

    );

}catch(error){

    console.error(
        "SEND ERROR",
        error
    );

    updateQueueStatus(
        job.id,
        "FAILED"
    );

    addFailed();

    clearCurrentJob();

    return {
        success:false,
        status:"FAILED",
        apiDuration:0,
        error:error.message
    };

}

    addHistory({

        campaignId:job.campaignId,

        timelineId:job.timelineId,

        templateId:job.templateId,

        phone:job.phone,

        contactName:job.contactName,

        status:result.status,

        apiDuration:result.apiDuration

    });

    if(result.success){

    addSuccess();

    updateQueueStatus(

        job.id,

        "SUCCESS"

    );

    window.dispatchEvent(

        new CustomEvent(

            "broadcast-progress",

            {

                detail:{

                    status:"SUCCESS",

                    campaign:job.campaignId,

                    template:job.templateId,

                    contact:job.contactName,

                    phone:job.phone,

                    message:job.message,

                    processed:

                    runner.processed + 1,

                    total:

                    runner.queueLength

                }

            }

        )

    );

}else{

    addFailed();

    updateQueueStatus(

        job.id,

        "FAILED"

    );

    window.dispatchEvent(

        new CustomEvent(

            "broadcast-progress",

            {

                detail:{

                    status:"FAILED",

                    campaign:job.campaignId,

                    template:job.templateId,

                    contact:job.contactName,

                    phone:job.phone,

                    message:job.message,

                    processed:

                    runner.processed + 1,

                    total:

                    runner.queueLength,

                    error:

                    result.error || ""

                }

            }

        )

    );

}

    nextRunnerJob();

    clearCurrentJob();

    return result;

}

export async function processQueue(

    context

){

    let lastResult = null;

    while(runner.running){

 const result =

await processNextJob(

    context

);      

        if(!result){

            break;

        }

        lastResult = result;

const averageDelay =

calculateAverageDelay(

    runner.queueLength,

    5

);

const variance =

Math.max(

    5,

    Math.floor(

        averageDelay * 0.30

    )

);

let delay =

averageDelay +

Math.floor(

    Math.random() *

    (variance * 2 + 1)

) - variance;

delay = Math.max(

    20,

    delay

);

delay = Math.min(

    120,

    delay

);

console.log(

    "Human Delay :",

    delay,

    "detik"

);

await sleep(

    delay

);
        
    }

    completeRunner();

    return lastResult;

}
