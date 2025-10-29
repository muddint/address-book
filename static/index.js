let currentContactId = null; //used for tracking whether a contact is selected to choose between add or edit contact form
let emailDeleteList = []; //used to track emails to delete when saving contact

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
    exitEditMode();
    hideUnselectedMessage();

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
        removeButton.classList.add('button-remove-email');
        removeButton.textContent = '-';
        removeButton.dataset.emailId = emailId;
        item.appendChild(removeButton);
                                                    
        emailList.appendChild(item);
    });

    //select on sidebar after loading contact if not yet selected
    const selectedContact = document.querySelector(`[data-contact-id = "${contactId}"]`) //searches by dataset attribute contactid
    if (selectedContact){
        selectedContact.classList.add('selected');
    }
}

/* Set up event listener for contact selection */
function setContactListListener() {
    const contactList = document.querySelector('.contact-list');
    contactList.addEventListener('click', (event) => {
        if (event.target.nodeName === 'LI') {
            //check if in edit mode, if hidden button is hidden then is in edit mode
            const isEditing = document.querySelector('.button-edit-contact').classList.contains('hidden');
            if (isEditing && !confirm('Discard any unsaved changes?')){
                return;
            }

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
 * @returns {Promise<number>} The ID of the newly created contact
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
        hideUnselectedMessage();
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
        enterEditMode(); //to enable saving/cancel
    });
}

/**
 * Send request to add email to contact
 * @param {number} contactId - The ID of the contact to add the email to
 * @param {string} emailAddress - The email address to add
 * @returns {Promise<number>} The ID of the newly added email
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
    //email input
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.classList.add('email-input');
    emailInput.placeholder = 'Enter email address';
    emailInput.value = emailAddress;
    //remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('button-remove-email');
    removeButton.textContent = '-';
    removeButton.addEventListener('click', () => {
        item.remove();
    });
    //error message
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error-message', 'hidden', 'error-email');
    errorMessage.textContent = 'Invalid email format';

    item.appendChild(emailInput);
    item.appendChild(removeButton);
    item.appendChild(errorMessage);
    emailList.appendChild(item);

    //focus input
    emailList.scrollTop = emailList.scrollHeight;
    emailInput.focus();

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
        clearErrors();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        if (!firstName){
            document.querySelector('.error-first-name').classList.remove('hidden'); //show error if no first name
            return;
        }
        if (currentContactId === null) { //add mode
            const newContactID = await addContact(firstName, lastName); 
            currentContactId = newContactID; //switch to edit mode after adding
        } else { //edit mode
            //name changes
            await updateContact(currentContactId, firstName, lastName);
            //delete emails
            for (const emailId of emailDeleteList){
                await deleteEmail(emailId);
            }
            emailDeleteList = []; //clear delete list
        }
    
        //validate emails
        const validatedEmails = [];
        const emailInputs = document.querySelectorAll('.email-input');
        for (const emailInput of emailInputs) {
            const emailAddress = emailInput.value.trim();
            if (emailAddress) { //make sure not empty 
                if (!validateEmailFormat(emailAddress)){ //if not valid show error
                    const errorMessage = emailInput.closest('.email-item').querySelector('.error-message');
                    errorMessage.classList.remove('hidden');
                    return;
                } else {
                    validatedEmails.push(emailAddress);
                }
            } //do nothing if empty
        }
        //add validated emails
        for (const validatedEmail of validatedEmails){
            await addEmail(currentContactId, validatedEmail);
        }

        //refresh and show updated contact info
        await loadContacts();
        showContactInfo(currentContactId);
        exitEditMode();
    });
}

/* Clears all error messages */
function clearErrors(){
    document.querySelectorAll('.error-message').forEach( errorMessage => {
        errorMessage.classList.add('hidden');
    });
}

/** 
 * Validate email format
 * @param {string} emailAddress - The email address to validate
 * @returns {boolean} True if valid email format, false otherwise
 */
function validateEmailFormat(emailAddress){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(emailAddress);
}

/** Send request to delete contact
 * @param {number} contactId - The ID of the contact to delete
 */
async function deleteContact(contactId) {
    await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
    })
    //refresh contact list
    await loadContacts();
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.querySelector('.email-list').innerHTML = '';
    currentContactId = null;
    showUnselectedMessage();
}

/* Set up event listener for delete contact button */
function setDeleteButtonListener(){
    const deleteButton = document.querySelector('.button-delete-contact');
    deleteButton.addEventListener('click', async () => {
        if (currentContactId !== null){
            if (confirm('Delete contact?')){
                await deleteContact(currentContactId);
            }
            currentContactId = null;
        }
        showUnselectedMessage();
    });
}

/* Set to edit mode */
function enterEditMode(){
    emailDeleteList = []; //clear list of emails to delete

    document.getElementById('first-name').disabled = false;
    document.getElementById('last-name').disabled = false;

    document.querySelector('.button-add-email').classList.remove('hidden');
    document.querySelector('.button-cancel-contact').classList.remove('hidden');
    document.querySelector('.button-save-contact').classList.remove('hidden');
    document.querySelector('.button-edit-contact').classList.add('hidden');
    //document.querySelector('.button-delete-contact').classList.add('hidden');

    document.querySelector('.email-list').classList.add('edit-emails');
}

/* Leave edit mode */
function exitEditMode(){
    clearErrors();
    document.getElementById('first-name').disabled = true;
    document.getElementById('last-name').disabled = true;

    document.querySelector('.button-add-email').classList.add('hidden');
    document.querySelector('.button-cancel-contact').classList.add('hidden');
    document.querySelector('.button-save-contact').classList.add('hidden');
    document.querySelector('.button-edit-contact').classList.remove('hidden');
    //document.querySelector('.button-delete-contact').classList.remove('hidden');

    document.querySelector('.email-list').classList.remove('edit-emails');
}


/* Set up event listener for edit contact button */
function setEditButtonListener(){
    const editButton = document.querySelector('.button-edit-contact');
    editButton.addEventListener('click', () => {
        enterEditMode();
    });
}

/* Set up event listener for cancel contact button */
function setCancelButtonListener(){
    const cancelButton = document.querySelector('.button-cancel-contact');
    cancelButton.addEventListener('click', async () => {
        if (currentContactId !== null){
            //cancel existing contact edit
            showContactInfo(currentContactId);
        } else { 
            //cancel creating new contact
            showUnselectedMessage();
        }
        exitEditMode(); 
    });
}

/**
 * Update contact info with changes to name
 * @param {number} contactId - The ID of the contact to update
 * @param {string} firstName - What first name of the contact should be updated to
 * @param {string} lastName - What last name of the contact should be updated to
 */
async function updateContact(contactId, firstName, lastName){
    await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'first_name': firstName,
            'last_name': lastName
        })
    });
}

/* Set up event listener for email delete buttons */
async function setEmailDeleteButtonListener(){
    const emailList = document.querySelector('.email-list'); //adding listener to email list so not too many listeners
    emailList.addEventListener('click', (event) =>{
        if (event.target.classList.contains('button-remove-email')){
            const removeButton = event.target;
            if (confirm('Remove email? You will still need to save to apply changes')){
                const emailId = removeButton.dataset.emailId; 
                if (emailId){ //prevents newly added but not saved emails from being added to delete list
                    emailDeleteList.push(emailId); //add to delete list
                }
                removeButton.closest('.email-item').remove(); //remove ancestor email item
            }
        }

    })
}

/**
 * Send request to delete email
 * @param {number} emailId - The ID of the email to delete
 */
async function deleteEmail(emailId){
    await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE'
    });
}

/* Show message saying no contact selected */
function showUnselectedMessage(){
    //hide main panel items
    document.querySelector('.unselected-message').style.display = 'flex';
    document.querySelector('form').style.display = 'none';
    document.querySelector('.contact-buttons').style.display = 'none';
}

/* Hide message saying no contact selected */
function hideUnselectedMessage(){
    //hide main panel items
    document.querySelector('.unselected-message').style.display = 'none';
    document.querySelector('form').style.display = 'flex';
    document.querySelector('.contact-buttons').style.display = 'flex';
}

/* Set all listeners for init */
function setListeners(){
    setContactListListener();
    setAddContactButtonListener();   
    setAddEmailButtonListener();
    setSaveButtonListener();
    setDeleteButtonListener();
    setEditButtonListener();
    setCancelButtonListener();
    setEmailDeleteButtonListener();
}


/* Initialize */
async function init(){
    await loadContacts();
    showUnselectedMessage();
    setListeners();
}

init();