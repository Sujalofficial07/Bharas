// ✅ Firebase Config
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
const auth = firebase.auth();

let currentChannel = "general";
let username = "Anonymous";

// Show login page if not logged in
auth.onAuthStateChanged(user => {
  if (user) {
    username = user.email.split("@")[0]; // simple username from email
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("chat-page").style.display = "flex";
    loadMessages();
  } else {
    document.getElementById("auth-page").style.display = "flex";
    document.getElementById("chat-page").style.display = "none";
  }
});

// Register
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Account created!"))
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut();
}

// Channels
function switchChannel(channel, element) {
  currentChannel = channel;
  document.querySelectorAll(".channel").forEach(c => c.classList.remove("active"));
  element.classList.add("active");
  document.getElementById("chat").innerHTML = "";
  loadMessages();
}

// Send message
function sendMessage() {
  const msg = document.getElementById("msg").value;
  if (!msg) return;
  db.ref("channels/" + currentChannel).push().set({
    user: username,
    text: msg,
    time: new Date().toLocaleTimeString()
  });
  document.getElementById("msg").value = "";
  db.ref("typing/" + currentChannel).remove();
}

// Load messages
function loadMessages() {
  db.ref("channels/" + currentChannel).off();
  db.ref("channels/" + currentChannel).on("child_added", snapshot => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<b>${data.user}:</b> ${parseEmojis(data.text)}<div class="meta">${data.time}</div>`;
    document.getElementById("chat").appendChild(div);
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  });

  // typing indicator
  db.ref("typing/" + currentChannel).on("value", snapshot => {
    const typingUser = snapshot.val();
    if (typingUser && typingUser !== username) {
      document.getElementById("typing-indicator").innerText = typingUser + " is typing...";
    } else {
      document.getElementById("typing-indicator").innerText = "";
    }
  });
}

// Typing
function showTyping() {
  db.ref("typing/" + currentChannel).set(username);
  setTimeout(() => db.ref("typing/" + currentChannel).remove(), 3000);
}

// Emoji parser
function parseEmojis(text) {
  return text.replace(":)", "😊").replace(":(", "😢").replace("<3", "❤️").replace(":D", "😁");
}
