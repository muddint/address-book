let currentContactId = null; //used for tracking whether a contact is selected to choose between add or edit contact form

/* Load contacts from the server and display them in the sidebar */
async function loadContacts() {
    const response = await fetch('/api/contacts');
    const data = await response.json();

    const contactList = document.querySelector('.contact-list');
    contactList.innerHTML = '';
    
    data.contacts.forEach(contact => {
        const item = document.createElement('li');
        item.textContent = `${contact.first_name} ${contact.last_name}`;
        item.dataset.contactId = contact.contact_id;
        contactList.appendChild(item);
    });
}

/**
 *  Show contact details in the main panel
 * @param {number} contactId - The ID of the contact to display
 */
async function showContactInfo(contactId){
    const response = await fetch(`/api/contacts/${contactId}`);
    const data = await response.json();

    document.getElementById('first-name').value = data.first_name;
    document.getElementById('last-name').value = data.last_name;

    const emails = data.emails;
    const emailList = document.querySelector('.email-list');
    emailList.innerHTML = '';
    emails.forEach(email => {
        const emailId = email.email_id;
        const emailAddress = email.email_address;
        const item = document.createElement('li');
        item.classList.add('email-item');
        item.textContent = emailAddress;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.classList.add('email-remove');
        removeButton.textContent = '-';
        removeButton.dataset.emailId = emailId;
        item.appendChild(removeButton);
                                                    
        emailList.appendChild(item);
    });
}

/* Set up event listener for contact selection */
function setContactListListener() {
    const contactList = document.querySelector('.contact-list');
    contactList.addEventListener('click', (event) => {
        if (event.target.nodeName === 'LI') {
            //update selected constact css
            const selectedContact = document.querySelector('.contact-list li.selected');
            if (selectedContact) {
                selectedContact.classList.remove('selected');
            }
            event.target.classList.add('selected');
            //show contact into on main panel
            const contactId = event.target.dataset.contactId;
            currentContactId = contactId; //set current contact id for edit mode
            showContactInfo(contactId);
        }
    });
}


/** 
 * Add a new contact to the server 
 * @param {string} firstName - The first name of the contact
 * @param {string} lastName - The last name of the contact
 * @returns {number} The ID of the newly created contact
 */
async function addContact(firstName, lastName) {
    const requestData = { first_name: firstName, last_name: lastName };
    const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    });
    const data = await response.json();
    return data.contact_id
}

/* Set up event listener for add contact button */
function setAddContactButtonListener() {
    const addContactButton = document.querySelector('.button-add-contact');
    addContactButton.addEventListener('click', () => {  
        //clear name and make editable
        document.getElementById('first-name').value = '';
        document.getElementById('last-name').value = '';
        document.getElementById('first-name').disabled = false;
        document.getElementById('last-name').disabled = false;
        //clear emails
        document.querySelector('.email-list').innerHTML = '';
        //deselect selected contact
        const selectedContact = document.querySelector('.contact-list li.selected');
        if (selectedContact) {
            selectedContact.classList.remove('selected');
        }
        currentContactId = null; //set to no contact selected, so form will be in add mode
    });
}

/**
 * Send request to add email to contact
 * @param {number} contactId - The ID of the contact to add the email to
 * @param {string} emailAddress - The email address to add
 * @returns {number} The ID of the newly added email
 */
async function addEmail(contactId, emailAddress) {
    const requestData = { 'email_address': emailAddress };
    const response = await fetch(`/api/contacts/${contactId}/emails`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    });
    const data = await response.json();
    showContactInfo(contactId);
    return data.email_id;
}

/**
 * Add email input field to contact panel
 * @param {*} emailAddress - An email of the contact, if none, then default to empty  
 */
function addEmailInput(emailAddress = ''){
    const emailList = document.querySelector('.email-list');
    const item = document.createElement('li');
    item.classList.add('email-item');

    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.classList.add('email-input');
    emailInput.placeholder = 'Enter email address';
    emailInput.value = emailAddress;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('email-remove');
    removeButton.textContent = '-';
    removeButton.addEventListener('click', () => {
        item.remove();
    });
    
    item.appendChild(emailInput);
    item.appendChild(removeButton);
    emailList.appendChild(item);
}

/* Set up event listener for add email button to create empty input field */
function setAddEmailButtonListener(){
    const addEmailButton = document.querySelector('.button-add-email');
    addEmailButton.addEventListener('click', () => {
        addEmailInput(); //will create empty email input field
    });
}

/* Set up event listener for save contact button */
async function setSaveButtonListener(){
    const saveButton = document.querySelector('.button-save-contact');
    saveButton.addEventListener('click', async () => {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        if (currentContactId === null) { //add mode
            const newContactID = await addContact(firstName, lastName); 
            const emailInputs = document.querySelectorAll('.email-input');
            for (const emailInput of emailInputs) {
                const emailAddress = emailInput.value.trim();
                if (emailAddress) { //make sure not empty 
                    await addEmail(newContactID, emailAddress);

                } //add delete if empty later ----------------------------------------------------------------
            }
            currentContactId = newContactID; //switch to edit mode after adding
        } else { //edit mode

        }
        await loadContacts();
        showContactInfo(currentContactId);
    });
}

/** * Send request to delete contact
 * @param {number} contactId - The ID of the contact to delete
 */
async function deleteContact(contactId) {
    const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
    })
    //refresh contact list
    await loadContacts();
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.querySelector('.email-list').innerHTML = '';
    currentContactId = null;
}

/* Set up event listener for delete contact button */
function setDeleteButtonListener(){
    const deleteButton = document.querySelector('.button-delete-contact');
    deleteButton.addEventListener('click', async () => {
        if (currentContactId !== null){
            if (confirm('Delete contact?')){
                await deleteContact(currentContactId);
            }
        }
    });
}

/* Initialize */
async function init(){
    await loadContacts();
    setContactListListener();
    setAddContactButtonListener();   
    setAddEmailButtonListener();
    setSaveButtonListener();
    setDeleteButtonListener();
}

init();