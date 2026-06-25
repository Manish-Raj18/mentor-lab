import "../css_files/roadmapbb.css";
function RoadMAp(){
    return(
        <div className="main">
        <div className="container">
        <header className="header">
            <h1>BBA Roadmap</h1>
            <p>Your step-by-step guide to Bachelor of Business Administration</p>
        </header>

        <div className="timeline">
            <div className="timeline-item left">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 1: Foundation</span>
                    <p className="focus"><strong>Focus:</strong>Building core business and analytical foundations.</p>
                    <ul className="subjects">
                        <li>Principles of Management</li>
                        <li>Financial Accounting</li>
                        <li>Business Communication</li>
                        <li>Microeconomics</li>
                        <li>Quantitative Methods</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item right">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 2: Core Subjects</span>
                    <p className="focus"><strong>Focus:</strong>Exploring key functional areas and dynamics of business management.</p>
                    <ul className="subjects">
                        <li>Marketing Management</li>
                        <li>Human Resource Management (HRM)</li>
                        <li>Production & Operations</li>
                        <li>Macroeconomics</li>
                        <li>Organizational Behaviour</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item left">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 3: Intermediate</span>
                    <p className="focus"><strong>Focus:</strong>Developing advanced core business and analytical skills.</p>
                    <ul className="subjects">
                        <li>Financial Management</li>
                        <li>Business Law & Ethics</li>
                        <li>Management Information Systems (MIS)</li>
                        <li>Marketing Rearch</li>
                        <li>Cost Accounting</li>
                        
                    </ul>
                </div>
            </div>

            <div className="timeline-item right">
                <div className="timeline-dot"></div>
                <div className="timeline-content">       
                    <span className="phase-tag">Phase 4: Specialization </span>
                    <p className="focus"><strong>Focus:</strong>Acquiring domain expertise through chosen electives.</p>
                    <p className="elective-title">Electives:</p>
                    <ul className="subjects">
                        <li>Finance</li>
                        <li>Marketing</li>
                        <li>HR</li>
                        <li>Entrepreneurship</li>
                        <li>Data Analytics</li>
                        <li>Supply Chain</li>
                       
                    </ul>
                </div>
            </div>

            <div className="timeline-item left">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 5: Practical</span>
                    <p className="focus"><strong>Focus:</strong>​Gaining real-world industry exposure and practical experience.</p>
                    <ul className="subjects">
                        <li>Internship & Projects</li>
                        <li>Final Capstone Project</li>
                        <li>Industry Training</li>
                        <li>Case Studies</li>
                        <li>Corporate Social Responsibility</li>
                    </ul>
                </div>
            </div>

            <div className="timeline-item right">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <span className="phase-tag">Phase 6: Graduation & Success</span>
                    <p className="focus"><strong>Focus:</strong>​Accelerating corporate readiness and career placement.</p>
                    <ul className="subjects">
                        <li>Strategic Management</li>
                        <li>Leadership Skills</li>
                        <li>Networking</li>
                        <li>Career Placement</li>
                        <li>Alumni Network</li>
                    </ul>
                </div>
            </div>    

        
        </div>
            <div className="note-container">
             <p> Note : If you want to learn more about BBA, feel free to visit our study notes for detailed and easy-to-understand content.</p> 
         </div>   

    </div>
    

        </div>
    )
}
export default RoadMAp