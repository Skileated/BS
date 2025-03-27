const client = {
    uploadImage: async (formData) => {
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }
};

export default client; 