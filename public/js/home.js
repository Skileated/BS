import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNX6_6m0eU9yf1v_lOBo-8nWo9yGX_AsM",
    authDomain: "blog-50ad9.firebaseapp.com",
    projectId: "blog-50ad9",
    storageBucket: "blog-50ad9.firebasestorage.app",
    messagingSenderId: "946160300805",
    appId: "1:946160300805:web:db63f6034ea5fc95c7bd6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const blogSection = document.querySelector('.blogs-section');

const createBlogCard = (blog) => {
    const data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title}</h1>
        <p class="blog-overview">${data.article.substring(0, 200)}...</p>
        <a href="/${blog.id}" class="btn dark">read</a>
    </div>
    `;
};

// Fetch and display blogs
const displayBlogs = async () => {
    try {
        const blogsSnapshot = await getDocs(collection(db, "blogs"));
        blogsSnapshot.forEach((blog) => {
            createBlogCard(blog);
        });
    } catch (error) {
        console.error("Error getting blogs: ", error);
    }
};

// Call the function when the page loads
displayBlogs(); 