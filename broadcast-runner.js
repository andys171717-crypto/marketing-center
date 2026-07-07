/* ==========================================
   BROADCAST RUNNER
   VERSION 1.0
========================================== */

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
