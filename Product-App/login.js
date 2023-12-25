const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const alertElement = document.querySelector('.alert');
const eyeIcon = document.getElementById('eye-icon');
const passwordToggle = document.getElementById('password-toggle');

const firebaseConfig = {
    apiKey: "AIzaSyCsg9lxDcvYuBbAiho0k3P6-_C2GTkud30",
    authDomain: "product-inventory-4b5f4.firebaseapp.com",
    databaseURL: "https://product-inventory-4b5f4-default-rtdb.firebaseio.com",
    projectId: "product-inventory-4b5f4",
    storageBucket: "product-inventory-4b5f4.appspot.com",
    messagingSenderId: "474540523393",
    appId: "1:474540523393:web:878845c6cbeddf218bb280"
};

firebase.initializeApp(firebaseConfig);
const productInventoryDB = firebase.firestore();

function login() {
    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed in:', user);
            window.location.href = 'products.html';
        })
        .catch((error) => {
            console.log("user not found");
            alertElement.style.display = "block";

            setTimeout(() => {
                alertElement.style.display = "none";
            }, 2000);
        });

    console.log("working");
}

passwordToggle.addEventListener('click', function () {
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    eyeIcon.className = isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
});
