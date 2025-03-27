import { app, db, auth } from './firebase.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import client from './client.js';

const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

// banner
const banner = document.querySelector('.banner');
const bannerImage = document.querySelector('#banner-upload');
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', async () => {
    const [file] = bannerImage.files;
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
        bannerPath = data;
        banner.style.backgroundImage = `url("${bannerPath}")`;
        banner.style.backgroundSize = 'cover';
        banner.style.backgroundPosition = 'center';
        alert('Image uploaded successfully!');
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
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
            alert('Please fill in all fields');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert('Please login to publish a post');
            return;
        }

        if(!bannerPath){
            bannerPath = '/img/Blogit.png';
        }

        // Create post data
        const postData = {
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            authorId: user.uid,
            publishedAt: new Date().toISOString(),
            categories: [], 
            tags: [],
            likes: 0
        };

        // Save to Firebase
        const docRef = await addDoc(collection(db, "blogs"), postData);
        
        // Save to server
        const serverResponse = await client.createPost({
            ...postData,
            id: docRef.id
        });

        if (serverResponse.success) {
            alert('Post published successfully!');
            location.href = `/${docRef.id}`;
        } else {
            throw new Error('Server failed to save post');
        }
    } catch (error) {
        console.error("Error publishing post:", error);
        alert('Failed to publish post. Please try again.');
    }
});