/* ==========================================
   ULTRAMSG SENDER
   VERSION 1.0
========================================== */

let config={

    apiUrl:"",

    instanceId:"",

    token:""

};

/* ==========================================
   INIT
========================================== */

export function initSender(

    senderConfig

){

    config={

        ...senderConfig

    };

}

/* ==========================================
   READY
========================================== */

export function isReady(){

    return(

        config.apiUrl!=="" &&

        config.instanceId!=="" &&

        config.token!==""

    );

}

/* ==========================================
   ENDPOINT
========================================== */

function endpoint(){

    return(

        `${config.apiUrl}/`+

        `${config.instanceId}`+

        `/messages/chat`

    );

}

/* ==========================================
   SEND MESSAGE
========================================== */

export async function sendMessage(

    phone,

    message

){

    const startedAt = Date.now();

    const url = endpoint();

    const payload = {

        token: config.token,

        to: phone,

        body: message

    };

    console.log("SEND URL :", url);

    console.log("SEND DATA :", payload);

    try{

        const response = await fetch(

            url,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(payload)

            }

        );

        const finishedAt = Date.now();

        const data = await response.json();

        console.log("ULTRAMSG RESPONSE :", data);

        return{

            success:response.ok,

            status:response.ok

                ? "SUCCESS"

                : "FAILED",

            apiDuration:

                finishedAt-startedAt,

            phone,

            response:data,

            error:

                data.message ||

                ""

        };

    }catch(error){

        console.error(

            "FETCH ERROR :",

            error

        );

        return{

            success:false,

            status:"FAILED",

            apiDuration:0,

            phone,

            response:null,

            error:error.message

        };

    }

}
