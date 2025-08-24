// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCpZxMl8oqttPIuEg5wjITJTJ8-swtF0xc",
  authDomain: "sg-website-a3bf4.firebaseapp.com",
  projectId: "sg-website-a3bf4",
  storageBucket: "sg-website-a3bf4.firebasestorage.app",
  messagingSenderId: "620775585240",
  appId: "1:620775585240:web:d98c3f97a92d1ea4cf6ead",
  measurementId: "G-DGCMH09V7T",
  databaseURL: "https://sg-website-a3bf4-default-rtdb.firebaseio.com/" // 👈 Add this manually
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentChannel = "general"; // default channel
const chatDiv = document.getElementById("chat");

function switchChannel(channel) {
  currentChannel = channel;
  chatDiv.innerHTML = ""; // clear chat
  loadMessages();
}

function sendMessage() {
  const msg = document.getElementById("msg").value;
  if (!msg) return;
  db.ref("channels/" + currentChannel).push().set({
    text: msg,
    time: Date.now()
  });
  document.getElementById("msg").value = "";
}

function loadMessages() {
  db.ref("channels/" + currentChannel).off(); // remove old listener
  db.ref("channels/" + currentChannel).on("child_added", function(snapshot) {
    const msg = snapshot.val().text;
    const div = document.createElement("div");
    div.className = "msg";
    div.textContent = msg;
    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  });
}

loadMessages(); // load default channel
