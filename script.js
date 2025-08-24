// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCpZxMl8oqttPIuEg5wjITJTJ8-swtF0xc",
  authDomain: "sg-website-a3bf4.firebaseapp.com",
  projectId: "sg-website-a3bf4",
  storageBucket: "sg-website-a3bf4.firebasestorage.app",
  messagingSenderId: "620775585240",
  appId: "1:620775585240:web:d98c3f97a92d1ea4cf6ead",
  measurementId: "G-DGCMH09V7T",
  databaseURL: "https://sg-website-a3bf4-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentChannel = "general"; // default channel
let username = "Anonymous";
const chatDiv = document.getElementById("chat");

function setUsername() {
  const name = document.getElementById("username").value;
  if (name.trim() !== "") {
    username = name;
    alert("Welcome " + username + "!");
  }
}

function switchChannel(channel, element) {
  currentChannel = channel;
  document.querySelectorAll(".channel").forEach(c => c.classList.remove("active"));
  element.classList.add("active");
  chatDiv.innerHTML = "";
  loadMessages();
}

function sendMessage() {
  const msg = document.getElementById("msg").value;
  if (!msg) return;
  db.ref("channels/" + currentChannel).push().set({
    user: username,
    text: msg,
    time: new Date().toLocaleTimeString()
  });
  document.getElementById("msg").value = "";
}

function loadMessages() {
  db.ref("channels/" + currentChannel).off();
  db.ref("channels/" + currentChannel).on("child_added", function(snapshot) {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<b>${data.user}:</b> ${parseEmojis(data.text)}<div class="meta">${data.time}</div>`;
    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

// Emoji Parser
function parseEmojis(text) {
  return text.replace(":)", "😊")
             .replace(":(", "😢")
             .replace("<3", "❤️")
             .replace(":D", "😁");
}

loadMessages();
document.body.classList.add("dark"); // default theme
