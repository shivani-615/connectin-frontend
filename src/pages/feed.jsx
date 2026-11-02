import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL, getMediaUrl } from '../lib/api';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Fetch posts from backend on page load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Proper Logout Function (Clears session data completely)
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Submit a new post using the logged-in user's dynamic name
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedImage) return;
    
    try {
      const token = localStorage.getItem("token");
      const currentUserName = localStorage.getItem("userName") || "User";
      
      const formData = new FormData();
      formData.append('content', newPost);
      formData.append('author', currentUserName);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const res = await axios.post(`${API_URL}/posts`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setPosts([res.data, ...posts]);
      setNewPost('');
      setSelectedImage(null);
    } catch (err) {
      console.error("Error creating post with image:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`${API_URL}/posts/${postId}/like`);
      setPosts(posts.map(post => (post._id === postId ? res.data : post)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      const currentUserName = localStorage.getItem("userName") || "User";
      const res = await axios.post(`${API_URL}/posts/${postId}/comment`, {
        text: commentText,
        author: currentUserName
      });
      setPosts(posts.map(post => (post._id === postId ? res.data : post)));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    alert("Post link copied to clipboard!");
  };

  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#ffffff', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ color: '#0a66c2', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>ConnectIn</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', alignItems: 'center' }}>
          <span style={{ color: '#0a66c2', fontWeight: 'bold', cursor: 'pointer' }}>Home</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>Profile</span>
          <span style={{ cursor: 'pointer', color: '#d32f2f', fontWeight: 'bold' }} onClick={handleLogout}>Logout</span>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '600px', margin: '24px auto', padding: '0 16px' }}>
        {/* Create Post Form */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e0e0e0', marginBottom: '16px' }}>
          <textarea
            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', boxSizing: 'border-box', resize: 'none', fontSize: '14px' }}
            rows="3"
            placeholder="What do you want to talk about?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              style={{ fontSize: '12px' }}
            />
            <button
              onClick={handlePostSubmit}
              style={{ backgroundColor: '#0a66c2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Post
            </button>
          </div>
          {selectedImage && <div style={{ fontSize: '12px', color: '#0a66c2', marginTop: '6px' }}>Selected: {selectedImage.name}</div>}
        </div>

        {/* Posts Stream */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', textAlign: 'center', border: '1px solid #e0e0e0', color: '#666', fontSize: '14px' }}>
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => {
            const postId = post._id || post.id;
            return (
              <div key={postId} style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e0e0e0', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>{post.author || "User"}</div>
                <p style={{ color: '#555', fontSize: '14px', margin: '0 0 8px 0' }}>{post.content || post.body}</p>
                
                {post.media && (
                  <div style={{ marginBottom: '12px' }}>
                    <img src={getMediaUrl(post.media)} alt="Post media" style={{ maxWidth: '100%', borderRadius: '4px', maxHeight: '300px', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  <span>👍 {post.likes || 0} Likes</span>
                  <span>{post.comments ? post.comments.length : 0} Comments</span>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', display: 'flex', justifyContent: 'space-around', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
                  <span style={{ cursor: 'pointer', color: '#0a66c2' }} onClick={() => handleLike(postId)}>👍 Like</span>
                  <span style={{ cursor: 'pointer', color: '#0a66c2' }} onClick={() => setActiveCommentPostId(activeCommentPostId === postId ? null : postId)}>💬 Comment</span>
                  <span style={{ cursor: 'pointer', color: '#0a66c2' }} onClick={() => handleShare(postId)}>🔄 Share</span>
                </div>

                {activeCommentPostId === postId && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                    <form onSubmit={(e) => handleCommentSubmit(postId, e)} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input 
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[postId] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [postId]: e.target.value })}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                      />
                      <button type="submit" style={{ backgroundColor: '#0a66c2', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Reply</button>
                    </form>

                    {post.comments && post.comments.map((comment, index) => (
                      <div key={index} style={{ backgroundColor: '#f9f9f9', padding: '6px 10px', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }}>
                        <strong>{comment.author || "User"}: </strong> {comment.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}