import { getAuth, onAuthStateChanged } from "firebase/auth";
import handleAuth from './auth.js';

const auth = getAuth();
const navLinks = document.querySelector('.links-container');

onAuthStateChanged(auth, (user) => {
    if (user) {
        navLinks.innerHTML = `
            <li class="link-item"><a href="/" class="link">home</a></li>
            <li class="link-item"><a href="/editor" class="link">editor</a></li>
            <li class="link-item"><a href="#" class="link" onclick="handleLogout()">logout</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li class="link-item"><a href="/" class="link">home</a></li>
            <li class="link-item"><a href="/auth" class="link">login</a></li>
        `;
    }
});

window.handleLogout = async () => {
    const result = await handleAuth.logout();
    if (result.success) {
        window.location.href = '/';
    } else {
        alert('Logout failed. Please try again.');
    }
}; 