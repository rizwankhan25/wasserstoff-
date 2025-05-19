'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/formStyles.css';
import TextInput from '@/components/TextInput';
import Button from './Button';
import FileUpload from './FileUpload';

export default function Form() {
  const router = useRouter();
  const fileInputRef = useRef();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    github: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/main');
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="w-100 rounded form-box" style={{ maxWidth: '500px' }}>
        
      <FileUpload onFileSelect={(file) => console.log('Selected file:', file)} />


        <TextInput
          label="Full Name"
          placeholder="Your name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />

        <TextInput
          label="Email address"
          placeholder="example@email.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextInput
          label="GitHub Username"
          placeholder="Your GitHub username"
          name="github"
          value={formData.github}
          onChange={handleChange}
        />

        <div className="d-grid">
        <Button type="submit">Generate My Ticket</Button>
        </div>
      </form>
    </div>
  );
}
