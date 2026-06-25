import {Link} from 'react-router-dom'
import "../css_files/style.css";
function Home() { 
  return (
<div className="home">
 
  <section className="hero">
    <video key="hero-video" autoPlay loop muted playsInline className="hero-video">
      <source src="/frontvideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="hero-left">
      <h1>A complete guide for Students.</h1>
      <p>
     "Empowering learners to turn mirrors into windows."
      </p>

      
    </div>

  </section>


  <section className="features">
    <h2><u>Why Choose Us?</u></h2>

    <div className="feature-cards">

      <div className="card">
        <h3>
         <Link to="/mock-test" className="card-link">100+ Mock Test</Link> 
        </h3>
        <p>Practice with high-quality exam-level questions.</p>
      </div>

      <div className="card">
        <h3>
            <Link to="/recorded-lectures" className="card-link">Recorded Lectures</Link>
        </h3>
        <p>Learn from top educators.</p>
      </div>

      <div className="card">
        <h3>
            <Link to="/study-notes" className="card-link">Study Notes</Link>
        </h3>
        <p>Get detailed notes and PDFs for all subjects.</p>
      </div>

      <div className="card">
        <h3>
            <a href="#" className="card-link">Performance Analytics</a>
        </h3>
        <p>Track your preparation with smart analysis tools.</p>
      </div>

    </div>
  </section>

 
  <section className="courses1">
    <h2>Popular Courses</h2>

    <div className="course-container">

      <div className="course-card">
        <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tcHV0ZXIlMjBzY2llbmNlfGVufDB8fDB8fHwww=600" alt=""/>
        <h3>BCA</h3>
        <p>Complete preparation course for BCA.</p>
         <Link to="/roadmapbca">
           <button>Explore</button>
        </Link>
      </div>

      <div className="course-card">
        <img src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBzdHVkaWVzfGVufDB8fDB8fHwww=600" alt=""/>
        <h3>BBA</h3>
        <p>Complete preparation course for BBA.</p>
         <Link to="/bbaroadmap">
           <button>Explore</button>
        </Link>
       
        
      </div>

      <div className="course-card">
        <img src="https://images.unsplash.com/photo-1727091506038-5451111dc2fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dw=100" alt=""/>
        <h3>BIOTECH</h3>
        <p>Complete preparation course for Biotech.</p>
      <Link to="/biotech">
           <button>Explore</button>
        </Link>
       
       
      </div>

    </div>
  </section>


  <footer className="footer">
    <p>© 2026 MENTOR LAB. All Rights Reserved.</p>
  </footer>



    </div>
  )
}

export default Home
