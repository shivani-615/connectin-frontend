import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const postsRes = await axios.get(`${API_URL}/posts`);
        const fetchedPosts = postsRes.data;
        setPosts(fetchedPosts);

        // Fetch users from backend DB if available, or build registered users dynamically from unique post authors
        try {
          const usersRes = await axios.get(`${API_URL}/users`);
          setUsers(usersRes.data);
        } catch (e) {
          // Dynamic fallback: Collect all unique authors who have created posts in the platform
          const uniqueAuthors = Array.from(new Set(fetchedPosts.map(p => p.author || "User")));
          const userList = uniqueAuthors.map((authorName) => ({
            name: authorName,
            email: `${authorName.toLowerCase().replace(/\s+/g, '')}@connectin.com`,
            role: 'User'
          }));
          setUsers(userList);
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Delete/Moderate a post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to remove this inappropriate post?")) return;
    try {
      await axios.delete(`${API_URL}/posts/${postId}`);
      setPosts(posts.filter(post => (post._id || post.id) !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#ffffff', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ color: '#d32f2f', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>ConnectIn Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', color: '#0a66c2', fontWeight: 'bold' }} onClick={() => router.push('/feed')}>Home Feed</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>Profile</span>
          <span style={{ cursor: 'pointer', color: '#d32f2f', fontWeight: 'bold' }} onClick={() => { localStorage.clear(); router.push('/login'); }}>Logout</span>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '800px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* Platform Statistics */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Registered Users</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0a66c2' }}>{users.length}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Active Posts</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0a66c2' }}>{posts.length}</p>
          </div>
        </div>

        {/* Registered Users Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginTop: 0, marginBottom: '16px' }}>Registered Active Users</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0', color: '#666' }}>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>No registered users found.</td>
                </tr>
              ) : (
                users.map((u, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#333' }}>{u.name}</td>
                    <td style={{ padding: '10px 8px', color: '#555' }}>{u.email}</td>
                    <td style={{ padding: '10px 8px', color: '#0a66c2' }}>{u.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Post Moderation */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginTop: 0, marginBottom: '16px' }}>Public Post Moderation</h2>
          {loading ? (
            <p style={{ color: '#666', textAlign: 'center' }}>Loading feed posts...</p>
          ) : posts.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No posts available to moderate.</p>
          ) : (
            posts.map((post) => {
              const postId = post._id || post.id;
              return (
                <div key={postId} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{post.author || "User"}</div>
                    <div style={{ fontSize: '13px', color: '#555', margin: '4px 0' }}>{post.content || post.body}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>Likes: {post.likes || 0} | Comments: {post.comments ? post.comments.length : 0}</div>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(postId)}
                    style={{ backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', height: 'fit-content' }}
                  >
                    Remove Post
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}