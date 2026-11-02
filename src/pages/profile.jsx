import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedBio = localStorage.getItem("userBio") || "B.Tech Computer Science Student | ConnectIn Member";
    
    setName(storedName);
    setEmail(storedEmail);
    setBio(storedBio);
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userBio", bio);
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#ffffff', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ color: '#0a66c2', margin: 0, fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => router.push('/feed')}>ConnectIn</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/feed')}>Home</span>
          <span style={{ color: '#0a66c2', fontWeight: 'bold', cursor: 'pointer' }}>Profile</span>
          <span style={{ cursor: 'pointer', color: '#d32f2f' }} onClick={() => router.push('/login')}>Logout</span>
        </div>
      </nav>

      {/* Profile Card Container */}
      <div style={{ maxWidth: '600px', margin: '24px auto', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e0e0e0' }}>
          <h2 style={{ color: '#333', marginTop: 0, fontSize: '20px' }}>Your Profile</h2>
          
          {message && <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>Bio / Headline</label>
              <textarea 
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'none', fontSize: '14px' }}
              />
            </div>

            <button 
              type="submit"
              style={{ backgroundColor: '#0a66c2', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', alignSelf: 'flex-start' }}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}