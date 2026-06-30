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
// DATA
// ==========================

let contacts =
JSON.parse(localStorage.getItem(STORAGE_CONTACTS)) || [];

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

    contactList.innerHTML = "";

    if(contacts.length === 0){

        contactList.innerHTML =
        "<p>Belum ada kontak.</p>";

        return;

    }

    contacts.forEach((item,index)=>{

        contactList.innerHTML += `

        <div class="contact-item">

            <h4>${item.name}</h4>

            <p>${item.phone}</p>

            <button onclick="deleteContact(${index})">

                Hapus

            </button>

        </div>

        `;

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

function init(){

    updateDashboard();

    renderContacts();

    renderTemplates();

    renderHistory();

}

init();

// ==========================
// CONTACT
// ==========================

function addContact(){

    const name =
    prompt("Nama Kontak");

    if(!name) return;

    const phone =
    prompt("Nomor WhatsApp");

    if(!phone) return;

    contacts.push({

        name:name,
        phone:phone

    });

    saveContacts();

    renderContacts();

    updateDashboard();

}

function deleteContact(index){

    if(!confirm("Hapus kontak ini?"))
        return;

    contacts.splice(index,1);

    saveContacts();

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

function startBroadcast(){

    if(
        broadcastMessage.value.trim()==""
    ){

        alert("Pesan masih kosong.");

        return;

    }

    history.unshift({

        name:
        broadcastName.value || "Broadcast",

        date:
        new Date().toLocaleString(),

        status:
        "Berhasil"

    });

    saveHistory();

    renderHistory();

    updateDashboard();

    alert(
        "Broadcast berhasil disimpan ke riwayat."
    );

}

// ==========================
// BUTTON
// ==========================

document
.getElementById("addContactBtn")
.onclick=addContact;

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

const oldStartBroadcast=startBroadcast;

startBroadcast=function(){

    if(!validateBroadcast())
        return;

    oldStartBroadcast();

    clearDraft();

    resetForm();

}

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

        name:"Andy",

        phone:"081234567890"

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

console.log(
"Marketing Center V1 Ready"
);

