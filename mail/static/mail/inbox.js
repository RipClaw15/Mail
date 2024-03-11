document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

  // Submit button
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function send_email(event) {
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      
      // Print result
      console.log(result);      
      load_mailbox('sent');
  });
}

function compose_email() {

  // Show compose view and hide other views
  
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
 
  

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox, searchQuery = null) {
  
  // Show the mailbox and hide other views
  let apiUrl = `/emails/${mailbox}`;
  if (searchQuery !== null) {
    apiUrl += `?search=${searchQuery}`;
  }
  
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  

  fetch(apiUrl)
  .then(response => response.json())
  .then(emails => {
      
      let emailList = document.createElement('ul');
      emailList.classList.add('emails');
      document.querySelector('#emails-view').appendChild(emailList);
      emails.forEach(email => {
        // create li for each mail
        const mail = document.createElement('li');
          mail.className = email.read ? 'read': 'not-read';
          if (mailbox === 'sent') {
              mail.innerHTML = `
                  <div class="email-item">  
                      <span class="sender">Sent to <b>${email['recipients']}</b></span>
                      <span class="subject">${email['subject']}</span>
                      <span class="timestamp"><b>${email['timestamp']}</b></span>
                        ${email.read ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-open" viewBox="0 0 16 16"><path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2"/></svg>' 
                        : 
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-down" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708l-1.25 1.25Z"/></svg>'}
                  </div>`;
          } else {
              mail.innerHTML = `
                  <div class="email-item">
                      <span class="sender"><b> ${email['sender']}</b></span>
                      <span class="subject">${email['subject']}</span>
                      <span class="timestamp"><b>${email['timestamp']}</b></span>   
                          ${email.read ? 
                          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-open" viewBox="0 0 16 16"><path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2"/></svg>' 
                          : 
                          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-down" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708l-1.25 1.25Z"/></svg>'}                           
                  </div>`;            
          } 
          mail.addEventListener('click', function () {
              fetch(`/emails/${email.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  read: true
              })
            })
              load_mail(`${email['id']}`);
          });     
          // Append the li to the ul
          emailList.appendChild(mail);
      });
        // ... do something else with emails ...
    });
  
}

function load_mail(id) {

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#mail-view').style.display = 'block';
      // Print email

      is_archived = email.archived ? 'Unarchive': 'Archive';
      
      document.querySelector('#mail-view').innerHTML =
      `<div class="mail-up">
                                  <span><b>From: </b>${email['sender']}    </span>
                                  <h2>  <b>${email['subject']}</h2></b>
                                  <span><b>${email['timestamp']} </b></span>
      </div>
                                  <b>To:         </b>${email['recipients']}<br>               
                                  <hr><span>${email['body']}      </span><br><hr>
      <div class="buttons">
      <div class="ra-buttons">    
                                  <button class="btn btn-sm btn-outline-primary" id="reply"><i class='fas fa-reply'></i> Reply </button>
                                  <button class="btn btn-sm btn-outline-success" id="archive"><i class="fa fa-archive"></i> ${is_archived}</button>
      </div>
                                  <button class="btn btn-sm btn-outline-secondary" id="read">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-down" viewBox="0 0 16 16">
                                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708l-1.25 1.25Z"/>
                                </svg>
                                 Mark as unread</button>
      </div>
      `;
      
      document.querySelector('#archive').addEventListener('click', () => {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: !email.archived
          })
        })
        .then(() => { load_mailbox('archive')})
      });
      document.querySelector('#read').addEventListener('click', () => {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: !email.read
          })
        })
        .then(() => { load_mailbox('inbox')})
      });
      document.querySelector('#reply').addEventListener('click', () => {compose_email(email);
        document.querySelector('#compose-recipients').value = email.sender;
            let subject = email.subject;
            if (subject.split(' ',1)[0] != "Re:"){
              subject = "Re: " + email.subject;
            }
        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n ` + email.body;
      })
      
  });
}



function changeBackground(value) {
  document.body.style.background = value;
  localStorage.setItem('background', value);
}

window.onload = function() {
  var storedBackground = localStorage.getItem('background');
  if (storedBackground) {
      document.body.style.background = storedBackground;
  }
};



function handleSearch() {
  const searchQuery = document.querySelector('input[name="search"]').value;
  
  load_mailbox('inbox', searchQuery);
  return false;  
}


