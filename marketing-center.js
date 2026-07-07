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

// ==========================
// USER SESSION
// ==========================

let currentUser = null;

let currentUid = null;

// ==========================
// STORAGE HELPER
// ==========================

function getStorageKey(baseKey){

    if(!currentUid){

        return baseKey;

    }

    return `${baseKey}_${currentUid}`;

}

/* ==========================================
   NORMALIZE PHONE
========================================== */

function normalizePhone(phone){

    if(!phone){

        return "";

    }

    phone = phone.trim();

    phone = phone.replace(/\D/g,"");

    if(phone.startsWith("0")){

        phone = "62" + phone.substring(1);

    }

    if(phone.startsWith("620")){

        phone = "62" + phone.substring(3);

    }

    if(phone.startsWith("8")){

        phone = "62" + phone;

    }

    return phone;

}

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

import {

    clearQueue,

    addQueue,

    getQueue,

    nextQueueJob,

    updateQueueStatus

}

from "./broadcast-queue.js";

import {

    generatePreview

}

from "./broadcast-preview.js";

import {

    startRunner,

    setCurrentJob,

    nextRunnerJob,

    completeRunner

}

from "./broadcast-runner.js";

import {

    sendMessage,

    initSender

}

from "./ultramsg-sender.js";

import {

    addHistory

}

from "./broadcast-history.js";

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

let templates = [];

let history = [];

let draft = null;

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

const contactSearch =
document.getElementById("contactSearch");

const toggleContactsBtn =
document.getElementById("toggleContactsBtn");

const contactListWrapper =
document.getElementById("contactListWrapper");

let contactVisible = false;

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

    // Kontak sudah menggunakan Firestore.
    // Fungsi ini sengaja dikosongkan.

}

function saveTemplates(){

    localStorage.setItem(

        getStorageKey(STORAGE_TEMPLATES),

        JSON.stringify(templates)

    );

}

function saveHistory(){

    localStorage.setItem(

        getStorageKey(STORAGE_HISTORY),

        JSON.stringify(history)

    );

}

function saveDraft(){

    localStorage.setItem(

        getStorageKey(STORAGE_DRAFT),

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

templates = JSON.parse(

    localStorage.getItem(

        getStorageKey(STORAGE_TEMPLATES)

    )

) || [];

draft = JSON.parse(

    localStorage.getItem(

        getStorageKey(STORAGE_DRAFT)

    )

) || null;

history = JSON.parse(

    localStorage.getItem(

        getStorageKey(STORAGE_HISTORY)

    )

) || [];

updateDashboard();

renderContacts();

renderTemplates();

renderHistory();

loadDraft();

renderContacts();

renderTemplates();

renderHistory();   

}

// init();

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

    clearQueue();

    let selectedContacts =

    contactGroup.value==="selected"

    ?

    contacts.filter(

        item=>item.selected

    )

    :

    contacts;

    for(const contact of selectedContacts){

        addQueue({

            campaignId:

            broadcastName.value,

            timelineId:

            "default",

            templateId:

            "default",

            phone:

            contact.phone,

            contactName:

            contact.name,

            schedule:

            sendMode.value

        });

    }

    const preview =

    generatePreview();

    alert(

`SMART BROADCAST PREVIEW

====================

Total Target : ${preview.total}

Siap Dikirim : ${preview.ok}

Warning : ${preview.warning}

Block : ${preview.block}`

    );

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
.onclick = async function(){

    const selectedContacts =
    contacts.filter(
        item => item.selected
    );

    if(selectedContacts.length===0){

        alert(
            "Belum ada kontak yang dipilih."
        );

        return;

    }

    if(
        !confirm(
            `Hapus ${selectedContacts.length} kontak yang dipilih?`
        )
    ){

        return;

    }

    for(const item of selectedContacts){

        await deleteContactFirestore(
            item.id
        );

    }

    contacts =
    await getContacts();

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

    draft = null;

    localStorage.removeItem(

        getStorageKey(STORAGE_DRAFT)

    );

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

    if(!validateBroadcast()){

        return;

    }

    clearQueue();

    const selectedContacts =

        contactGroup.value==="selected"

        ?

        contacts.filter(

            item=>item.selected

        )

        :

        contacts;

    if(selectedContacts.length===0){

        alert(

            "Belum ada kontak yang dipilih."

        );

        return;

    }

    for(const contact of selectedContacts){

        addQueue({

            campaignId:

            broadcastName.value,

            timelineId:

            "default",

            templateId:

            "default",

            phone:

            contact.phone,

            contactName:

            contact.name,

            schedule:

            sendMode.value

        });

    }

    const preview =

    generatePreview();

    if(preview.block>0){

        alert(

`Broadcast dibatalkan.

Masih ada ${preview.block} data yang diblokir.

Silakan buka Preview terlebih dahulu.`

        );

        return;

    }

    startRunner(

        getQueue()

    );

    initSender({

        apiUrl:

        ultraApiUrl.value,

        instanceId:

        ultraInstanceId.value,

        token:

        ultraToken.value

    });

    alert(

        "Runner berhasil dijalankan.\n\nTahap berikutnya kita akan mulai mengirim Queue satu per satu."

    );

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

const splashScreen =
document.getElementById("splashScreen");

const googleLoginBtn =
document.getElementById("googleLoginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const currentUserEmail =
document.getElementById("currentUserEmail");

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

    async function(user){

        currentUser = user;

        currentUid = user ? user.uid : null;

        if(user){

            await init();

currentUserEmail.textContent =
user.email;

        }

        splashScreen.style.display = "none";

        if(user){

            loginScreen.style.display = "none";

            appScreen.style.display = "block";

        }

else{

    currentUserEmail.textContent =
    "Belum Login";

    loginScreen.style.display = "flex";

    appScreen.style.display = "none";

}       

    }

);

/* ==========================================
   IMPORT CSV
========================================== */

const importCsvBtn =
document.getElementById("importCsvBtn");

const importCsvModal =
document.getElementById("importCsvModal");

const chooseCsvBtn =
document.getElementById("chooseCsvBtn");

const closeImportModalBtn =
document.getElementById("closeImportModalBtn");

const csvFileInput =
document.getElementById("csvFileInput");

const csvFileName =
document.getElementById("csvFileName");

const previewCsvBtn =
document.getElementById("previewCsvBtn");

importCsvBtn.onclick = function(){

    importedContacts = [];

    csvFileInput.value = "";

    csvFileName.textContent =
    "Belum ada file dipilih.";

    document.getElementById(
        "importPreview"
    ).style.display = "none";

    document.getElementById(
        "previewStats"
    ).innerHTML = "";

    document.getElementById(
        "previewList"
    ).innerHTML = "";

    importCsvModal.style.display = "flex";

};

closeImportModalBtn.onclick = function(){

    importedContacts = [];

    csvFileInput.value = "";

    csvFileName.textContent =
    "Belum ada file dipilih.";

    document.getElementById(
        "importPreview"
    ).style.display = "none";

    document.getElementById(
        "previewStats"
    ).innerHTML = "";

    document.getElementById(
        "previewList"
    ).innerHTML = "";

    importCsvModal.style.display = "none";

};

chooseCsvBtn.onclick = function(){

    csvFileInput.click();

};


csvFileInput.onchange = function(){

    if(this.files.length){

        csvFileName.textContent =
        this.files[0].name;

    }

};

previewCsvBtn.onclick = function(){

    if(!csvFileInput.files.length){

        alert("Silakan pilih file CSV terlebih dahulu.");

        return;

    }

    const file = csvFileInput.files[0];

    const reader = new FileReader();

reader.onload = function(e){

    const text = e.target.result;

    const importType =
    document.getElementById("importType").value;

    if(importType==="vcf"){

        previewVCF(text);

        return;

    }

    alert("Preview CSV akan dibuat pada tahap berikutnya.");

};   

    reader.readAsText(file);

};

/* ==========================================
   VCF PREVIEW
========================================== */

let importedContacts = [];

function previewVCF(text){

    const previewBox =
    document.getElementById("importPreview");

    const previewStats =
    document.getElementById("previewStats");

    const previewList =
    document.getElementById("previewList");

    const cards =
    text.split("BEGIN:VCARD");

    let total = 0;

    let html = "";

    importedContacts = [];

    for(const card of cards){

        if(!card.includes("TEL")){

            continue;

        }

        total++;

        const nameMatch =
        card.match(/FN:(.+)/);

        const telMatch =
        card.match(/TEL[^:]*:(.+)/);

        const name =
        nameMatch ?
        nameMatch[1].trim() :
        "(Tanpa Nama)";

const rawPhone =
telMatch ?
telMatch[1] :
"";

const phone =
normalizePhone(rawPhone);     

importedContacts.push({

    name:name,

    phone:phone,

    category:"customer",

    status:"active",

    selected:false,

    notes:"",

    tags:["default"]

});

        if(total<=30){

            html += `

            <div class="preview-item">

                <span>${name}</span>

                <span>${phone}</span>

            </div>

            `;

        }

    }

    previewBox.style.display = "block";

    previewStats.innerHTML = `

        <b>Total Kontak :</b> ${total}<br>

        <b>Preview :</b> 30 kontak pertama

    `;

    previewList.innerHTML = html;

}

const startImportBtn =
document.getElementById("startImportBtn");

startImportBtn.onclick = async function(){

    if(importedContacts.length===0){

        alert("Belum ada kontak yang siap diimport.");

        return;

    }

contacts = await getContacts();

const existingPhones =
new Set(

    contacts.map(

        item => normalizePhone(item.phone)

    )

);

let success = 0;

let duplicate = 0;

for(const item of importedContacts){

    const phone =
    normalizePhone(item.phone);

    if(

        phone === "" ||

        existingPhones.has(phone)

    ){

        duplicate++;

        continue;

    }

    item.phone = phone;

    await addContactFirestore(item);

    existingPhones.add(phone);

    success++;

}

contacts = await getContacts();

renderContacts();

updateDashboard();   

 importedContacts = [];

csvFileInput.value = "";

csvFileName.textContent =
"Belum ada file dipilih.";

document.getElementById(
    "importPreview"
).style.display = "none";

document.getElementById(
    "previewStats"
).innerHTML = "";

document.getElementById(
    "previewList"
).innerHTML = "";

importCsvModal.style.display = "none"; 

 alert(

    "Import selesai\n\n"+

    "Berhasil : "+success+"\n"+

    "Duplikat : "+duplicate

); 

};

/* ==========================================
   CONTACT TOOLBAR
========================================== */

toggleContactsBtn.onclick = function(){

    contactVisible = !contactVisible;

    if(contactVisible){

        contactListWrapper.style.display = "block";

        toggleContactsBtn.textContent =
        "📁 Sembunyikan Kontak";

    }else{

        contactListWrapper.style.display = "none";

        toggleContactsBtn.textContent =
        "📂 Tampilkan Kontak";

    }

};

contactSearch.oninput = function(){

    const keyword =
    this.value
    .trim()
    .toLowerCase();

    document
    .querySelectorAll(".contact-item")
    .forEach(item=>{

        item.style.display =
        item.innerText
        .toLowerCase()
        .includes(keyword)

        ? ""

        : "none";

    });

};
