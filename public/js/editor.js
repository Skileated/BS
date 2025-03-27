import { app, auth, db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import client from './client.js';

const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', async () => {
    const [file] = bannerImage.files;
    if (!file || !file.type.includes("image")) {
        alert('Please select a valid image file');
        return;
    }

    const formdata = new FormData();
    formdata.append('image', file);
    
    try {
        const response = await client.uploadImage(formdata);
        bannerPath = response; // Store the path returned from server
        // Update banner preview
        banner.style.backgroundImage = `url(${bannerPath})`;
        banner.style.backgroundSize = 'cover';
        banner.style.backgroundPosition = 'center';
        banner.style.backgroundColor = '#e7e7e7';
    } catch (error) {
        console.error('Error uploading banner:', error);
        alert('Failed to upload banner image');
    }
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = async (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (!file) {
        alert('Please select an image');
        return;
    }
    
    if (!file.type.includes("image")) {
        alert('Please upload an image file');
        return;
    }

    const formdata = new FormData();
    formdata.append('image', file);
    
    try {
        const data = await client.uploadImage(formdata);
        if (uploadType === "image") {
            addImage(data, file.name);
        } else {
            bannerPath = data;
            banner.style.backgroundImage = `url("${bannerPath}")`;
            banner.style.backgroundSize = 'cover';
            banner.style.backgroundPosition = 'center';
        }
        alert('Image uploaded successfully!');
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
    }
};

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
};

let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

publishBtn.addEventListener('click', async () => {
    try {
        if(!articleField.value.length || !blogTitleField.value.length){
            alert('Please fill all fields');
            return;
        }

        if(!bannerPath){
            bannerPath = '/img/default-banner.jpg'; // Default banner if none uploaded
        }

        const post = {
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: new Date().toISOString(),
            author: auth.currentUser ? auth.currentUser.uid : 'anonymous'
        };

        // Save to Firestore
        const docRef = await addDoc(collection(db, "blogs"), post);
        
        if(docRef.id) {
            alert('Post published successfully!');
            location.href = `/${docRef.id}`; // Redirect to the published post
        }
    } catch (error) {
        console.error('Error publishing post:', error);
        alert('Failed to publish post. Please try again.');
    }
});