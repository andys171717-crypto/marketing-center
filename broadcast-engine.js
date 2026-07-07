/* ==========================================
   BROADCAST ENGINE
   VERSION 1.0
========================================== */

/* ==========================================
   ENGINE STATUS
========================================== */

let engine = {

    running:false,

    paused:false,

    stopped:false,

    campaignId:null,

    timelineId:null,

    queue:[],

    currentIndex:0,

    success:0,

    failed:0,

    skipped:0,

    startedAt:null,

    finishedAt:null

};

/* ==========================================
   GET ENGINE
========================================== */

export function getEngine(){

    return engine;

}

/* ==========================================
   RESET ENGINE
========================================== */

export function resetEngine(){

    engine.running=false;

    engine.paused=false;

    engine.stopped=false;

    engine.campaignId=null;

    engine.timelineId=null;

    engine.queue=[];

    engine.currentIndex=0;

    engine.success=0;

    engine.failed=0;

    engine.skipped=0;

    engine.startedAt=null;

    engine.finishedAt=null;

}

/* ==========================================
   START
========================================== */

export function startEngine(

    campaignId

){

    resetEngine();

    engine.running=true;

    engine.campaignId=campaignId;

    engine.startedAt=Date.now();

}

/* ==========================================
   PAUSE
========================================== */

export function pauseEngine(){

    engine.paused=true;

}

/* ==========================================
   RESUME
========================================== */

export function resumeEngine(){

    engine.paused=false;

}

/* ==========================================
   STOP
========================================== */

export function stopEngine(){

    engine.running=false;

    engine.stopped=true;

    engine.finishedAt=Date.now();

}

/* ==========================================
   QUEUE
========================================== */

export function setQueue(queue){

    engine.queue = [...queue];

    engine.currentIndex = 0;

}

export function getQueue(){

    return engine.queue;

}

export function getCurrentJob(){

    if(

        engine.currentIndex>=

        engine.queue.length

    ){

        return null;

    }

    return engine.queue[

        engine.currentIndex

    ];

}

export function nextJob(){

    engine.currentIndex++;

}

export function hasNextJob(){

    return (

        engine.currentIndex<

        engine.queue.length

    );

}

/* ==========================================
   HUMAN DELAY ENGINE
========================================== */

function randomBetween(

    min,

    max

){

    return Math.floor(

        Math.random() *

        (max-min+1)

    ) + min;

}

export function generateHumanDelay(

    min = 8,

    max = 18

){

    let delay =

    randomBetween(

        min,

        max

    );

    if(

        Math.random() < 0.08

    ){

        delay +=

        randomBetween(

            20,

            60

        );

    }

    return delay;

}

export function generateBatchBreak(

    min = 120,

    max = 360

){

    return randomBetween(

        min,

        max

    );

}

export function generateTimelineBreak(

    min = 300,

    max = 900

){

    return randomBetween(

        min,

        max

    );

}
