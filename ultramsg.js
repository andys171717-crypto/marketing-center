/* ==========================================
   ULTRAMSG ENGINE
   VERSION 1.0
========================================== */

const UltraMsg = (()=>{

    const STORAGE_KEY =
    "ultramsg_config";

    let config =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    ) || {

        apiUrl:
        "https://api.ultramsg.com",

        instanceId:"",

        token:""

    };

    function save(){

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(config)

        );

    }

    function load(){

        return config;

    }

    function configure({

        apiUrl,

        instanceId,

        token

    }){

        config.apiUrl =
        apiUrl.trim();

        config.instanceId =
        instanceId.trim();

        config.token =
        token.trim();

        save();

    }

    function isConfigured(){

        return(

            config.instanceId!=="" &&

            config.token!=="" &&

            config.apiUrl!==""

        );

    }

    function endpoint(path){

        return `${config.apiUrl}/${config.instanceId}/${path}`;

    }

    async function testConnection(){

        if(!isConfigured()){

            throw new Error(

                "UltraMsg belum dikonfigurasi."

            );

        }

        const url =

        endpoint("instance/status")+

        `?token=${config.token}`;

        const response =
        await fetch(url);

        return await response.json();

    }

    return{

        load,

        save,

        configure,

        isConfigured,

        endpoint,

        testConnection

    };

})();

/* ==========================================
   SEND MESSAGE
========================================== */

UltraMsg.sendMessage = async function(to, body){

    if(!UltraMsg.isConfigured()){

        throw new Error(
            "UltraMsg belum dikonfigurasi."
        );

    }

    const form = new URLSearchParams();

    form.append(
        "token",
        UltraMsg.load().token
    );

    form.append(
        "to",
        to
    );

    form.append(
        "body",
        body
    );

    const response = await fetch(

        UltraMsg.endpoint("messages/chat"),

        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/x-www-form-urlencoded"
            },

            body:form

        }

    );

    return await response.json();

};

/* ==========================================
   SEND MULTIPLE
========================================== */

UltraMsg.sendBulk = async function(

    numbers,

    message,

    onProgress

){

    const result={

        success:0,

        failed:0,

        total:numbers.length,

        logs:[]

    };

    for(

        let i=0;

        i<numbers.length;

        i++

    ){

        const phone =

        numbers[i];

        try{

            const send =

            await UltraMsg.sendMessage(

                phone,

                message

            );

            result.success++;

            result.logs.push({

                phone,

                status:"success",

                response:send

            });

        }

        catch(error){

            result.failed++;

            result.logs.push({

                phone,

                status:"failed",

                error:error.message

            });

        }

        if(onProgress){

            onProgress({

                current:i+1,

                total:numbers.length,

                success:result.success,

                failed:result.failed

            });

        }

        await new Promise(

            resolve=>

            setTimeout(resolve,1500)

        );

    }

    return result;

};

/* ==========================================
   FORMAT NUMBER
========================================== */

UltraMsg.formatNumber=function(number){

    let phone=

    number

    .replace(/\s/g,"")

    .replace(/\-/g,"");

    if(

        phone.startsWith("08")

    ){

        phone="62"+phone.substring(1);

    }

    if(

        phone.startsWith("+62")

    ){

        phone=

        phone.replace("+","");

    }

    return phone;

};

/* ==========================================
   VALIDATE NUMBER
========================================== */

UltraMsg.isValidNumber=function(

    number

){

    const phone=

    UltraMsg.formatNumber(

        number

    );

    return /^62\d{8,15}$/

    .test(phone);

};

console.log(

    "UltraMsg Engine Ready"

);

