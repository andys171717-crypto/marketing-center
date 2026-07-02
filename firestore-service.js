/* ==========================================
   FIRESTORE SERVICE
   MARKETING CENTER
   VERSION 1.0
========================================== */

import { db } from "./firebase-config.js";

import {

    collection,

    getDocs,

    addDoc,

    updateDoc,

    deleteDoc,

    doc,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* ==========================================
   COLLECTION
========================================== */

const CONTACTS =
collection(
    db,
    "mc_contacts"
);

/* ==========================================
   GET CONTACTS
========================================== */

export async function getContacts(){

    const snapshot =
    await getDocs(CONTACTS);

    const data=[];

    snapshot.forEach(item=>{

        data.push({

            id:item.id,

            ...item.data()

        });

    });

    return data;

}

/* ==========================================
   ADD CONTACT
========================================== */

export async function addContact(contact){

    return await addDoc(

        CONTACTS,

        {

            ...contact,

            createdAt:
            serverTimestamp(),

            updatedAt:
            serverTimestamp()

        }

    );

}

/* ==========================================
   UPDATE CONTACT
========================================== */

export async function updateContact(

    id,

    data

){

    return await updateDoc(

        doc(

            db,

            "mc_contacts",

            id

        ),

        {

            ...data,

            updatedAt:
            serverTimestamp()

        }

    );

}

/* ==========================================
   DELETE CONTACT
========================================== */

export async function deleteContact(id){

    return await deleteDoc(

        doc(

            db,

            "mc_contacts",

            id

        )

    );

}

/* ==========================================
   IMPORT CONTACTS
========================================== */

export async function importContacts(contacts){

    const ids = [];

    for(const contact of contacts){

        const ref = await addDoc(

            CONTACTS,

            {

                ...contact,

                createdAt: serverTimestamp(),

                updatedAt: serverTimestamp()

            }

        );

        ids.push(ref.id);

    }

    return ids;

}

console.log(
    "Firestore Service Ready"
);
