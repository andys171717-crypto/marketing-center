/* ==========================================
   BROADCAST SCHEDULER
   VERSION 1.0
========================================== */

/* ==========================================
   WAIT
========================================== */

export function wait(

    seconds

){

    return new Promise(

        resolve=>{

            setTimeout(

                resolve,

                seconds*1000

            );

        }

    );

}

/* ==========================================
   RANDOM
========================================== */

export function randomBetween(

    min,

    max

){

    return Math.floor(

        Math.random()*

        (

            max-min+1

        )

    )+min;

}

/* ==========================================
   HUMAN DELAY
========================================== */

export function humanDelay(

    min=8,

    max=18

){

    let delay=

    randomBetween(

        min,

        max

    );

    if(

        Math.random()<0.08

    ){

        delay+=

        randomBetween(

            20,

            60

        );

    }

    return delay;

}

/* ==========================================
   BATCH BREAK
========================================== */

export function batchBreak(

    min=120,

    max=360

){

    return randomBetween(

        min,

        max

    );

}

/* ==========================================
   TIMELINE BREAK
========================================== */

export function timelineBreak(

    min=300,

    max=900

){

    return randomBetween(

        min,

        max

    );

}
