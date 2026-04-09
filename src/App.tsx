import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiGithub, FiExternalLink, FiMail, FiUser, FiBriefcase, FiCode, FiSend } from 'react-icons/fi';
import Loader from './components/Loader';

interface User {
  name: string;
  email: string;
  bio: string;
  education: string;
  skills: string[];
  avatar: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink?: string;
}

function App() {

  const API_URL = 'https://mern-portfolio-backend-ea15.onrender.com';

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/user`)
      .then(res => setUser(res.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoadingUser(false));
    
    axios.get(`${API_URL}/api/projects`)
      .then(res => setProjects(res.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoadingProjects(false));
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/contact`, form);
      toast.success('✨ Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('❌ Failed to send. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser || loadingProjects) return <Loader />;

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#1e293b', color: '#fff' } }} />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white min-vh-100 d-flex align-items-center position-relative overflow-hidden">
        <div className="container text-center py-5">
          <img 
            src={user?.avatar || 'https://ui-avatars.com/api/?name=Harshad+Soyaliya&background=667eea&color=fff&size=140'} 
            alt={user?.name} 
            className="rounded-circle border border-4 border-white shadow-lg mb-4 animate-scale" 
            width="140" height="140" 
            style={{ objectFit: 'cover' }}
          />
          <h1 className="display-3 fw-bold animate-fade-up">{user?.name}</h1>
          <p className="lead fs-4 mb-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>{user?.email}</p>
          <p className="fs-5 mx-auto animate-fade-up" style={{ maxWidth: '700px', animationDelay: '0.2s' }}>{user?.bio}</p>
          <div className="mt-5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#projects" className="btn btn-light btn-lg rounded-pill px-5 me-3 fw-semibold shadow-sm">View Work</a>
            <a href="#contact" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-semibold">Contact Me</a>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 animate-bounce">
          <FiCode size={32} className="opacity-75" />
        </div>
      </section>

      {/* Education & Skills Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="glass-card p-4 h-100 animate-fade-up">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <FiUser size={32} className="text-primary" />
                  <h2 className="h3 mb-0 fw-bold">Education</h2>
                </div>
                <p className="lead mb-0">{user?.education}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass-card p-4 h-100 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <FiBriefcase size={32} className="text-primary" />
                  <h2 className="h3 mb-0 fw-bold">Skills</h2>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {user?.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-5 bg-light">
        <div className="container">
          <h2 className="display-5 fw-bold text-center mb-5">Featured Projects</h2>
          <div className="row g-4">
            {projects.map((proj, idx) => (
              <div key={proj._id} className="col-md-6 col-lg-4">
                <div className="glass-card p-4 h-100 hover-glow animate-fade" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3 className="h4 fw-bold mb-3">{proj.title}</h3>
                  <p className="text-secondary mb-3">{proj.description}</p>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {proj.technologies.map(tech => (
                      <span key={tech} className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-normal">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="d-flex gap-4">
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center gap-1 text-dark">
                      <FiGithub /> GitHub
                    </a>
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center gap-1 text-dark">
                        <FiExternalLink /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="glass-card p-4 p-md-5 animate-fade-up">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <FiMail size={32} className="text-primary" />
                  <h2 className="h3 mb-0 fw-bold">Get In Touch</h2>
                </div>
                <form onSubmit={handleContact}>
                  <div className="mb-3">
                    <input type="text" className="form-control form-control-lg" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control form-control-lg" placeholder="Your Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <textarea rows={5} className="form-control form-control-lg" placeholder="Your Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-lg rounded-pill px-5 d-flex align-items-center gap-2 mx-auto">
                    <FiSend /> {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-top bg-white">
        <p className="mb-0 text-secondary">© {new Date().getFullYear()} Academic Portfolio | Built with MERN Stack + TypeScript + Bootstrap</p>
      </footer>
    </>
  );
}

export default App;