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

async function showContactInfo(contactId){
    const response = await fetch(`/api/contacts/${contactId}`);
    const data = await response.json();

    document.getElementById('first-name').value = data.first_name;
    document.getElementById('last-name').value = data.last_name;

    const emails = data.emails;
    const emailList = document.querySelector('.email-list');
    emailList.innerHTML = '';
    emails.forEach(email => {
        const emailId = email[0];
        const emailAddress = email[1];
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

function setContactListener() {
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
            showContactInfo(contactId);
        }
    });
    
}

loadContacts();
setContactListener();