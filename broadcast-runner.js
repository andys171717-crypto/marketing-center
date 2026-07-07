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
   PROCESS ONE JOB
========================================== */

export async function processNextJob(

    message

){

    const job = nextQueueJob();

    if(!job){

        completeRunner();

        return null;

    }

    setCurrentJob(job);

    const result = await sendMessage(

        job.phone,

        message

    );

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

    }else{

        addFailed();

        updateQueueStatus(

            job.id,

            "FAILED"

        );

    }

    nextRunnerJob();

    clearCurrentJob();

    return result;

}
