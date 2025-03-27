import { app, db, auth } from "./firebase.js";
import { doc, getDoc, onSnapshot, collection } from "firebase/firestore";
import handleInteractions from "./interactions.js";

const blogId = decodeURI(location.pathname.split("/").pop());
const docRef = doc(db, "blogs", blogId);

getDoc(docRef).then((doc) => {
  if (doc.exists()) {
    setupBlog(doc.data());
  } else {
    location.replace("/");
  }
});

const setupBlog = (data) => {
  const banner = document.querySelector(".banner");
  const blogTitle = document.querySelector(".title");
  const titleTag = document.querySelector("title");
  const publish = document.querySelector(".published");

  banner.style.backgroundImage = `url(${data.bannerImage})`;

  titleTag.innerHTML += blogTitle.innerHTML = data.title;
  publish.innerHTML += data.publishedAt;

  const article = document.querySelector(".article");
  addArticle(article, data.article);

  // Add like button and count
  const likeSection = document.createElement("div");
  likeSection.className = "like-section";
  likeSection.innerHTML = `
        <button class="like-btn ${
          data.likes.includes(auth.currentUser?.uid) ? "liked" : ""
        }">
            ❤ ${data.likes.length}
        </button>
    `;

  // Add comment section
  const commentSection = document.createElement("div");
  commentSection.className = "comment-section";
  commentSection.innerHTML = `
        <h3>Comments</h3>
        <div class="comments-list">
            ${
              data.comments
                ?.map(
                  (comment) => `
                <div class="comment">
                    <p>${comment.comment}</p>
                    <small>${new Date(
                      comment.createdAt
                    ).toLocaleDateString()}</small>
                </div>
            `
                )
                .join("") || ""
            }
        </div>
        <div class="comment-form">
            <textarea placeholder="Write a comment..."></textarea>
            <button class="comment-btn">Post Comment</button>
        </div>
    `;

  // Add event listeners
  const likeBtn = likeSection.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => handleInteractions.likePost(blogId));

  const commentBtn = commentSection.querySelector(".comment-btn");
  const commentText = commentSection.querySelector("textarea");
  commentBtn.addEventListener("click", () => {
    if (commentText.value.trim()) {
      handleInteractions.addComment(blogId, commentText.value.trim());
      commentText.value = "";
    }
  });

  article.appendChild(likeSection);
  article.appendChild(commentSection);
};

const addArticle = (ele, data) => {
  data = data.split("\n").filter((item) => item.length);

  data.forEach((item) => {
    // Check for heading
    if (item[0] === "#") {
      let hCount = 0;
      let i = 0;
      while (item[i] === "#") {
        hCount++;
        i++;
      }
      let tag = `h${hCount}`;
      ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`;
    }
    // Check for image format
    else if (item[0] === "!" && item[1] === "[") {
      let separator;
      for (let i = 0; i <= item.length; i++) {
        if (
          item[i] === "]" &&
          item[i + 1] === "(" &&
          item[item.length - 1] === ")"
        ) {
          separator = i;
          break;
        }
      }
      let alt = item.slice(2, separator);
      let src = item.slice(separator + 2, item.length - 1);
      ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
    } else {
      ele.innerHTML += `<p>${item}</p>`;
    }
  });
};
