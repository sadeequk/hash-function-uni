// script.js

document.getElementById('generate-hash-btn').addEventListener('click', generateHash);
document.getElementById('send-message-btn').addEventListener('click', sendMessage);
document.getElementById('modify-message-btn').addEventListener('click', modifyAndSend);
document.getElementById('verify-hash-btn').addEventListener('click', verifyHash);

let generatedHash = '';
let receivedMessage = '';
let receivedHash = '';

// Function to generate hash
async function generateHash() {
  const message = document.getElementById('sender-message').value;
  const file = document.getElementById('sender-file').files[0];
  if (message) {
    generatedHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
    generatedHash = Array.from(new Uint8Array(generatedHash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    document.getElementById('generated-hash').textContent = generatedHash;
  } else if (file) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const fileHash = await crypto.subtle.digest('SHA-256', event.target.result);
      generatedHash = Array.from(new Uint8Array(fileHash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      document.getElementById('generated-hash').textContent = generatedHash;
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please enter a message or select a file.');
  }
}

// Function to send message
function sendMessage() {
  receivedMessage = document.getElementById('sender-message').value;
  receivedHash = generatedHash;
  document.getElementById('intercepted-message').value = receivedMessage;
  document.getElementById('intercepted-hash').value = receivedHash;
}

// Function to modify and send message
function modifyAndSend() {
  receivedMessage = document.getElementById('intercepted-message').value;
  receivedHash = document.getElementById('intercepted-hash').value;
  document.getElementById('received-message').textContent = receivedMessage;
  document.getElementById('received-hash').textContent = receivedHash;
}

// Function to verify hash
async function verifyHash() {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(receivedMessage));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  if (hashString === receivedHash) {
    document.getElementById('verification-result').textContent =
      'Verification Successful: Message integrity maintained.';
  } else {
    document.getElementById('verification-result').textContent = 'Verification Failed: Message integrity compromised.';
  }
}
