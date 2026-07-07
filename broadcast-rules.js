/* ==========================================
   BROADCAST RULES
   VERSION 1.0
========================================== */

/* ==========================================
   RULE LEVEL
========================================== */

export const RULE_LEVEL={

    INFO:"info",

    WARNING:"warning",

    BLOCK:"block"

};

/* ==========================================
   CREATE RESULT
========================================== */

export function createRuleResult(){

    return{

        passed:true,

        level:RULE_LEVEL.INFO,

        code:"",

        title:"",

        message:""

    };

}

/* ==========================================
   INVALID PHONE
========================================== */

export function invalidPhoneRule(

    phone

){

    const result=

    createRuleResult();

    if(

        !phone ||

        phone.length<10

    ){

        result.passed=false;

        result.level=

        RULE_LEVEL.BLOCK;

        result.code=

        "INVALID_PHONE";

        result.title=

        "Nomor Tidak Valid";

        result.message=

        "Nomor tujuan tidak valid.";

    }

    return result;

}

/* ==========================================
   DUPLICATE PHONE
========================================== */

export function duplicatePhoneRule(

    phone,

    phoneSet

){

    const result=

    createRuleResult();

    if(

        phoneSet.has(phone)

    ){

        result.passed=false;

        result.level=

        RULE_LEVEL.BLOCK;

        result.code=

        "DUPLICATE_PHONE";

        result.title=

        "Nomor Duplikat";

        result.message=

        "Nomor muncul lebih dari satu kali pada queue.";

    }

    return result;

}
