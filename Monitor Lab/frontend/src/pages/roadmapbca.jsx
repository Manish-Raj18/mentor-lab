import "../css_files/roadmapbca.css";
function BcaRoadmap(){
    return(
        <div className="main">
        <div className="container">
        <header className="header">
            <h1>BCA Roadmap</h1>
            <p>Your step-by-step guide to Bachelor of Computer Applications</p>
        </header>

        <div className="timeline">
            <div className="timeline-item left">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 1: Foundation</span>
                    <p className="focus"><strong>Focus:</strong> Building core programming and mathematical foundations.</p>
                    <ul className="subjects">
                        <li>Programming in C</li>
                        <li>Discrete Mathematics</li>
                        <li>Computer Fundamentals</li>
                        <li>Business Communication</li>
                        <li>Environmental Studies</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item right">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 2: Core Subjects</span>
                    <p className="focus"><strong>Focus:</strong> Exploring key computing concepts and data management.</p>
                    <ul className="subjects">
                        <li>Data Structures & Algorithms</li>
                        <li>Object-Oriented Programming (Java)</li>
                        <li>Database Management Systems</li>
                        <li>Operating Systems</li>
                        <li>Computer Architecture</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item left">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 3: Intermediate</span>
                    <p className="focus"><strong>Focus:</strong> Developing advanced software and web development skills.</p>
                    <ul className="subjects">
                        <li>Web Technologies (HTML, CSS, JavaScript)</li>
                        <li>Software Engineering</li>
                        <li>Computer Networks</li>
                        <li>Python Programming</li>
                        <li>Theory of Computation</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item right">
                <div className="timeline-dot"></div>
                <div className="timeline-content">       
                    <span className="phase-tag">Phase 4: Specialization</span>
                    <p className="focus"><strong>Focus:</strong> Acquiring domain expertise through chosen electives.</p>
                    <p className="elective-title">Electives:</p>
                    <ul className="subjects">
                        <li>Artificial Intelligence & ML</li>
                        <li>Cyber Security</li>
                        <li>Cloud Computing</li>
                        <li>Mobile App Development</li>
                        <li>Data Science & Analytics</li>
                        <li>Internet of Things (IoT)</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item left">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 5: Practical</span>
                    <p className="focus"><strong>Focus:</strong> Gaining real-world industry exposure and practical experience.</p>
                    <ul className="subjects">
                        <li>Internship & Projects</li>
                        <li>Final Capstone Project</li>
                        <li>Industry Training</li>
                        <li>Hackathons & Coding Competitions</li>
                        <li>Open Source Contributions</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item right">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 6: Graduation & Success</span>
                    <p className="focus"><strong>Focus:</strong> Accelerating career readiness and placement.</p>
                    <ul className="subjects">
                        <li>System Design & Architecture</li>
                        <li>Problem Solving & DSA Practice</li>
                        <li>Portfolio Building</li>
                        <li>Career Placement</li>
                        <li>Alumni Network</li>
                    </ul>
                </div>
            </div>    

        
        </div>
            <div className="note-container">
             <p> Note : If you want to learn more about BCA, feel free to visit our study notes for detailed and easy-to-understand content.</p> 
         </div>   

    </div>
    

    </div>
     )
}
export default BcaRoadmap
