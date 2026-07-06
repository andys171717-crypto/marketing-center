/* ==========================================
   MARKETING CENTER
   VERSION 1.0
========================================== */

// ==========================
// STORAGE KEY
// ==========================

const STORAGE_CONTACTS = "mc_contacts";
const STORAGE_TEMPLATES = "mc_templates";
const STORAGE_HISTORY = "mc_history";
const STORAGE_DRAFT = "mc_draft";

// ==========================================
// FIRESTORE
// ==========================================

import {

    getContacts,

    addContact as addContactFirestore,

    updateContact as updateContactFirestore,

    deleteContact as deleteContactFirestore

}

from "./firestore-service.js";

import {

    auth,

    googleProvider

}

from "./firebase-config.js";

import {

    signInWithPopup,

    signOut,

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// ==========================================
// ULTRAMSG CONFIG
// ==========================================

const STORAGE_ULTRA =
"mc_ultramsg";

let ultraConfig =
JSON.parse(
localStorage.getItem(STORAGE_ULTRA)
) || {

    apiUrl:
    "https://api.ultramsg.com",

    instanceId:"",

    token:""

};

// ==========================================
// SAVE CONFIG
// ==========================================

function saveUltraConfig(){

    localStorage.setItem(

        STORAGE_ULTRA,

        JSON.stringify(
            ultraConfig
        )

    );

}

// ==========================================
// LOAD CONFIG
// ==========================================

function loadUltraConfig(){

    return ultraConfig;

}

// ==========================================
// UPDATE CONFIG
// ==========================================

function updateUltraConfig(

    apiUrl,

    instanceId,

    token

){

    ultraConfig.apiUrl =
    apiUrl.trim();

    ultraConfig.instanceId =
    instanceId.trim();

    ultraConfig.token =
    token.trim();

    saveUltraConfig();

}

// ==========================================
// CHECK CONFIG
// ==========================================

function hasUltraConfig(){

    return(

        ultraConfig.instanceId!=="" &&

        ultraConfig.token!=="" &&

        ultraConfig.apiUrl!==""


    );

}

// ==========================================
// API URL
// ==========================================

function getUltraEndpoint(){

    return `${ultraConfig.apiUrl}/${ultraConfig.instanceId}/messages/chat`;

}

// ==========================================
// CONNECTION STATUS
// ==========================================

let ultraStatus={

    connected:false,

    lastTest:null,

    message:"Belum diuji"

};

// ==========================================
// SAVE STATUS
// ==========================================

function setUltraStatus(

    connected,

    message

){

    ultraStatus.connected=

    connected;

    ultraStatus.message=

    message;

    ultraStatus.lastTest=

    new Date()

    .toLocaleString();

}

// ==========================================
// TEST CONNECTION
// ==========================================

async function testUltraConnection(){

    if(

        !hasUltraConfig()

    ){

        alert(

        "Konfigurasi UltraMsg belum lengkap."

        );

        return false;

    }

    try{

        const response=

        await fetch(

            `${ultraConfig.apiUrl}/${ultraConfig.instanceId}/instance/status`+

            `?token=${ultraConfig.token}`

        );

        if(

            response.ok

        ){

            setUltraStatus(

                true,

                "Terhubung"

            );

            alert(

                "UltraMsg berhasil terhubung."

            );

            return true;

        }

        setUltraStatus(

            false,

            "Gagal"

        );

        alert(

            "Koneksi gagal."

        );

        return false;

    }

    catch(error){

        console.error(error);

        setUltraStatus(

            false,

            error.message

        );

        alert(

            "Tidak dapat terhubung."

        );

        return false;

    }

}

// ==========================
// DATA
// ==========================

let contacts = [];

let templates =
JSON.parse(localStorage.getItem(STORAGE_TEMPLATES)) || [];

let history =
JSON.parse(localStorage.getItem(STORAGE_HISTORY)) || [];

let draft =
JSON.parse(localStorage.getItem(STORAGE_DRAFT)) || null;

// ==========================
// ELEMENT
// ==========================

const totalContacts =
document.getElementById("totalContacts");

const totalTemplates =
document.getElementById("totalTemplates");

const totalBroadcast =
document.getElementById("totalBroadcast");

const contactList =
document.getElementById("contactList");

const templateList =
document.getElementById("templateList");

const historyList =
document.getElementById("historyList");

const broadcastName =
document.getElementById("broadcastName");

const broadcastMessage =
document.getElementById("broadcastMessage");

const contactGroup =
document.getElementById("contactGroup");

const sendMode =
document.getElementById("sendMode");

const scheduleDate =
document.getElementById("scheduleDate");

const scheduleTime =
document.getElementById("scheduleTime");

// ==========================
// ULTRAMSG ELEMENT
// ==========================

const ultraApiUrl =
document.getElementById("ultraApiUrl");

const ultraInstanceId =
document.getElementById("ultraInstanceId");

const ultraToken =
document.getElementById("ultraToken");

const editUltraBtn =
document.getElementById("editUltraBtn");

const testUltraBtn =
document.getElementById("testUltraBtn");

const ultraStatusText =
document.getElementById("ultraStatus");

// ==========================
// SAVE
// ==========================

function saveContacts(){

    localStorage.setItem(
        STORAGE_CONTACTS,
        JSON.stringify(contacts)
    );

}

function saveTemplates(){

    localStorage.setItem(
        STORAGE_TEMPLATES,
        JSON.stringify(templates)
    );

}

function saveHistory(){

    localStorage.setItem(
        STORAGE_HISTORY,
        JSON.stringify(history)
    );

}

function saveDraft(){

    localStorage.setItem(
        STORAGE_DRAFT,
        JSON.stringify(draft)
    );

}

// ==========================
// DASHBOARD
// ==========================

function updateDashboard(){

    totalContacts.textContent =
    contacts.length;

    totalTemplates.textContent =
    templates.length;

    totalBroadcast.textContent =
    history.length;

}

// ==========================
// RENDER CONTACT
// ==========================

function renderContacts(){

    contactList.innerHTML="";

    if(contacts.length===0){

        contactList.innerHTML=
        "<p>Belum ada kontak.</p>";

        return;

    }

    contacts.forEach((item,index)=>{

        contactList.innerHTML+=`

<div class="contact-item">

<label style="display:flex;align-items:center;gap:12px;">

<input
type="checkbox"
class="contact-check"
data-index="${index}"
${item.selected ? "checked" : ""}>

<div style="flex:1;">

<h4>${item.name}</h4>

<p>${item.phone}</p>

<small>${item.category}</small>

</div>

</label>

<button onclick="deleteContact(${index})">

Hapus

</button>

</div>

`;

    });

    bindContactCheckbox();

}

// ==========================
// CONTACT CHECKBOX
// ==========================

function bindContactCheckbox(){

    document
    .querySelectorAll(".contact-check")
    .forEach(item=>{

        item.onchange=function(){

            const index=
            Number(this.dataset.index);

            contacts[index].selected=
            this.checked;

            saveContacts();

        };

    });

}

// ==========================
// RENDER TEMPLATE
// ==========================

function renderTemplates(){

    templateList.innerHTML = "";

    if(templates.length===0){

        templateList.innerHTML =
        "<p>Belum ada template.</p>";

        return;

    }

    templates.forEach((item,index)=>{

        templateList.innerHTML += `

        <div class="template-item">

            <h4>${item.title}</h4>

            <p>${item.message}</p>

            <button onclick="useTemplate(${index})">

                Gunakan

            </button>

        </div>

        `;

    });

}

// ==========================
// RENDER HISTORY
// ==========================

function renderHistory(){

    historyList.innerHTML = "";

    if(history.length===0){

        historyList.innerHTML =
        "Belum ada riwayat.";

        return;

    }

    history.forEach(item=>{

        historyList.innerHTML += `

        <div class="history-item">

            <h4>${item.name}</h4>

            <p>${item.date}</p>

            <span class="badge success">

                ${item.status}

            </span>

        </div>

        `;

    });

}

// ==========================
// INIT
// ==========================

async function init(){

    contacts = await getContacts();

    updateDashboard();

    renderContacts();

    renderTemplates();

    renderHistory();

}

init();

// ==========================
// CONTACT
// ==========================

async function addContact(){

    const name =
    prompt("Nama Kontak");

    if(!name) return;

    const phone =
    prompt("Nomor WhatsApp");

    if(!phone) return;

    await addContactFirestore({

        name:name,

        phone:phone,

        category:"customer",

        status:"active",

        selected:false,

        notes:"",

        tags:["default"]

    });

    contacts = await getContacts();

    renderContacts();

    updateDashboard();

}

async function deleteContact(index){

    if(
        !confirm("Hapus kontak ini?")
    ){
        return;
    }

    await deleteContactFirestore(
        contacts[index].id
    );

    contacts =
    await getContacts();

    renderContacts();

    updateDashboard();

}

// ==========================
// TEMPLATE
// ==========================

function addTemplate(){

    const title =
    prompt("Nama Template");

    if(!title) return;

    const message =
    prompt("Isi Template");

    if(!message) return;

    templates.push({

        title:title,
        message:message

    });

    saveTemplates();

    renderTemplates();

    updateDashboard();

}

function useTemplate(index){

    broadcastMessage.value =
    templates[index].message;

}

// ==========================
// DRAFT
// ==========================

function saveCurrentDraft(){

    draft={

        name:
        broadcastName.value,

        message:
        broadcastMessage.value,

        group:
        contactGroup.value,

        mode:
        sendMode.value,

        date:
        scheduleDate.value,

        time:
        scheduleTime.value

    };

    saveDraft();

    alert("Draft berhasil disimpan.");

}

function loadDraft(){

    if(!draft) return;

    broadcastName.value =
    draft.name || "";

    broadcastMessage.value =
    draft.message || "";

    contactGroup.value =
    draft.group || "all";

    sendMode.value =
    draft.mode || "now";

    scheduleDate.value =
    draft.date || "";

    scheduleTime.value =
    draft.time || "";

}

// ==========================
// PREVIEW
// ==========================

function previewBroadcast(){

    const text=

`Nama Broadcast :

${broadcastName.value}

-----------------------

Target :

${contactGroup.value}

-----------------------

Pesan :

${broadcastMessage.value}

-----------------------

Mode :

${sendMode.value}

Tanggal :

${scheduleDate.value}

Jam :

${scheduleTime.value}
`;

    alert(text);

}

// ==========================
// HISTORY
// ==========================

async function startBroadcast(){

    if(!validateBroadcast()){
        return;
    }

    if(contacts.length===0){

        alert("Belum ada kontak.");

        return;

    }

let numbers=[];

if(contactGroup.value==="selected"){

    numbers=

    contacts

    .filter(item=>item.selected)

    .map(item=>item.phone);

}
else{

    numbers=

    contacts

    .map(item=>item.phone);

}

if(numbers.length===0){

    alert(

        "Belum ada kontak yang dipilih."

    );

    return;

}

    try{

        const result =
        await UltraMsg.sendBulk(

            numbers,

            broadcastMessage.value,

            (progress)=>{

                console.log(
                    "Progress :",
                    progress
                );

            }

        );

        history.unshift({

            name:
            broadcastName.value || "Broadcast",

            date:
            new Date().toLocaleString(),

            status:
            `Berhasil ${result.success}/${result.total}`

        });

        saveHistory();

        renderHistory();

        updateDashboard();

        clearDraft();

        resetForm();

        alert(

            `Broadcast selesai\n\n`+

            `Berhasil : ${result.success}\n`+

            `Gagal : ${result.failed}\n`+

            `Skip : ${result.skipped}`

        );

    }

    catch(error){

        console.error(error);

        alert(

            "Broadcast gagal.\n\n"+

            error.message

        );

    }

}

// ==========================
// BUTTON
// ==========================

document
.getElementById("addContactBtn")
.onclick=addContact;

document
.getElementById("selectAllBtn")
.onclick=function(){

    const checked=
    contacts.some(item=>!item.selected);

    contacts.forEach(item=>{

        item.selected=
        checked;

    });

    saveContacts();

    renderContacts();

};

document
.getElementById("deleteSelectedBtn")
.onclick=function(){

    const total=
    contacts.filter(
        item=>item.selected
    ).length;

    if(total===0){

        alert(
            "Belum ada kontak yang dipilih."
        );

        return;

    }

    if(
        !confirm(
            `Hapus ${total} kontak yang dipilih?`
        )
    ){

        return;

    }

    contacts=
    contacts.filter(
        item=>!item.selected
    );

    saveContacts();

    renderContacts();

    updateDashboard();

};

document
.getElementById("newTemplateBtn")
.onclick=addTemplate;

document
.getElementById("previewBtn")
.onclick=previewBroadcast;

document
.getElementById("saveDraftBtn")
.onclick=saveCurrentDraft;

document
.getElementById("startBroadcastBtn")
.onclick=startBroadcast;

loadDraft();

// ==========================================
// RESET FORM
// ==========================================

function resetForm(){

    broadcastName.value="";

    broadcastMessage.value="";

    contactGroup.value="all";

    sendMode.value="now";

    scheduleDate.value="";

    scheduleTime.value="";

}

// ==========================================
// CLEAR DRAFT
// ==========================================

function clearDraft(){

    draft=null;

    localStorage.removeItem(STORAGE_DRAFT);

}

// ==========================================
// VALIDATION
// ==========================================

function validateBroadcast(){

    if(
        broadcastName.value.trim()===""
    ){

        alert("Nama Broadcast belum diisi.");

        return false;

    }

    if(
        broadcastMessage.value.trim()===""
    ){

        alert("Isi pesan masih kosong.");

        return false;

    }

    return true;

}

// ==========================================
// START BROADCAST (V1)
// ==========================================

const oldStartBroadcast = startBroadcast;

startBroadcast = async function(){

    await oldStartBroadcast();

};

// ==========================================
// AUTO SAVE DRAFT
// ==========================================

[
broadcastName,
broadcastMessage,
contactGroup,
sendMode,
scheduleDate,
scheduleTime
].forEach(item=>{

    item.addEventListener("change",()=>{

        draft={

            name:broadcastName.value,

            message:broadcastMessage.value,

            group:contactGroup.value,

            mode:sendMode.value,

            date:scheduleDate.value,

            time:scheduleTime.value

        };

        saveDraft();

    });

});

// ==========================================
// SAMPLE DATA
// ==========================================

if(contacts.length===0){

    contacts.push({

    id:Date.now(),

    name:"Andy",

    phone:"081234567890",

    category:"customer",

    selected:false

});

    saveContacts();

}

if(templates.length===0){

    templates.push({

        title:"Undangan Mitra",

        message:
"Halo Pak/Bu, kami ingin mengundang Anda bergabung menjadi mitra."

    });

    saveTemplates();

}

// ==========================================
// REFRESH
// ==========================================

updateDashboard();

renderContacts();

renderTemplates();

renderHistory();

// ==========================================
// ULTRAMSG UI
// ==========================================

function loadUltraToForm(){

    const cfg =
    UltraMsg.getConfig();

    ultraApiUrl.value =
    cfg.apiUrl || "";

    ultraInstanceId.value =
    cfg.instanceId || "";

    ultraToken.value =
    cfg.token || "";

}

let ultraEditMode=false;

editUltraBtn.onclick=function(){

    if(!ultraEditMode){

        ultraEditMode=true;

        ultraApiUrl.readOnly=false;

        ultraInstanceId.readOnly=false;

        ultraToken.readOnly=false;

        editUltraBtn.textContent=
        "💾 Simpan Konfigurasi";

        return;

    }

    UltraMsg.init({

        apiUrl:
        ultraApiUrl.value,

        instanceId:
        ultraInstanceId.value,

        token:
        ultraToken.value

    });

    ultraApiUrl.readOnly=true;

    ultraInstanceId.readOnly=true;

    ultraToken.readOnly=true;

    ultraEditMode=false;

    editUltraBtn.textContent=
    "✏ Edit Konfigurasi";

    alert(
        "Konfigurasi UltraMsg berhasil disimpan."
    );

};

testUltraBtn.onclick = async function(){

    try{

        UltraMsg.init({

            apiUrl: ultraApiUrl.value,

            instanceId: ultraInstanceId.value,

            token: ultraToken.value

        });

        const result =
        await UltraMsg.testConnection();

        ultraStatusText.textContent =
        "Status : ✅ Terhubung";

        console.log(result);

    }

    catch(error){

        ultraStatusText.textContent =
        "Status : ❌ Gagal";

        console.error(error);

        alert(error.message);

    }

};

loadUltraToForm();

console.log(
"Marketing Center V1 Ready"
);

// ==========================================
// GOOGLE LOGIN
// ==========================================

const loginScreen =
document.getElementById("loginScreen");

const appScreen =
document.getElementById("app");

const googleLoginBtn =
document.getElementById("googleLoginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

googleLoginBtn.onclick = async function(){

    try{

        await signInWithPopup(
            auth,
            googleProvider
        );

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

logoutBtn.onclick = async function(){

    try{

        await signOut(auth);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

onAuthStateChanged(

    auth,

    function(user){

        if(user){

            loginScreen.style.display="none";

            appScreen.style.display="block";

        }

        else{

            loginScreen.style.display="flex";

            appScreen.style.display="none";

        }

    }

);
