import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const handleInteractions = {
    likePost: async (postId) => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to like posts');
            return;
        }

        const postRef = doc(db, "blogs", postId);
        try {
            await updateDoc(postRef, {
                likes: arrayUnion(user.uid)
            });
            return { success: true };
        } catch (error) {
            console.error("Error liking post:", error);
            return { success: false, error: error.message };
        }
    },

    addComment: async (postId, comment) => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to comment');
            return;
        }

        const postRef = doc(db, "blogs", postId);
        try {
            await updateDoc(postRef, {
                comments: arrayUnion({
                    userId: user.uid,
                    comment: comment,
                    createdAt: new Date().toISOString()
                })
            });
            return { success: true };
        } catch (error) {
            console.error("Error adding comment:", error);
            return { success: false, error: error.message };
        }
    }
};

export default handleInteractions; 