import "../css_files/recorded.css";
import { useState } from "react";

function RecordedLectures(){
    const [currentLecture, setCurrentLecture] = useState({
        video: "/intro2.mp4",
        title: "Introduction",
        description: "Welcome to Mentor Lab Recorded Lectures."
    });

    return(
        <div className="abc">
        <div className="rl-header">
    <h1>Recorded Lectures</h1>
    <p>Watch and revise at your own pace.</p>
  </div>

  
  <div className="container">

    
    <div className="video-section">

      <video controls key={currentLecture.video}>
        <source src={currentLecture.video} type="video/mp4"/>
        Your browser does not support video.
      </video>

      <h2 className="lecture-title">
        {currentLecture.title}
      </h2>

      

      <div className="description">
        <p>
          {currentLecture.description}
        </p>
      </div>

    </div>

    
    <div className="playlist-sidebar">

      <h2>Course Playlist</h2>

      <div className="playlist-item" onClick={() => setCurrentLecture({
          video: "/intro2.mp4",
          title: "Introduction",
          description: "Welcome to Mentor Lab Recorded Lectures."
      })} style={{cursor: "pointer"}}>
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Introduction</h4>
    
          <p>Intro</p>
        </div>
      </div>

      <div className="playlist-item" onClick={() => setCurrentLecture({
          video: "/html-tutorial-crash-course.mp4",
          title: "Lecture 1 - HTML Basics",
          description: "HTML Tutorial for Beginners - HTML Crash Course. Learn HTML from scratch."
      })} style={{cursor: "pointer"}}>
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 1 - HTML Basics</h4>
    
          <p>1:09:33 hrs</p>
        </div>
      </div>

      <div className="playlist-item" onClick={() => setCurrentLecture({
          video: "/learn-css-in-1-hour.mp4",
          title: "Lecture 2 - CSS Styling",
          description: "Learn CSS in 1 hour. Master CSS fundamentals."
      })} style={{cursor: "pointer"}}>
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 2 - CSS Styling</h4>
          <p>1:00:00 hrs</p>
        </div>
      </div>

      <div className="playlist-item" onClick={() => setCurrentLecture({
          video: "/complete-flexbox-in-1-video.mp4",
          title: "Lecture 3 - Flexbox & Grid",
          description: "Complete FLEXBOX in 1 Video. Master Flexbox layout."
      })} style={{cursor: "pointer"}}>
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 3 - Flexbox & Grid</h4>
          <p>58:19 hrs</p>
        </div>
      </div>

      <div className="playlist-item" onClick={() => setCurrentLecture({
          video: "/responsive-web-development.mp4",
          title: "Lecture 4 - Responsive Design",
          description: "Responsive Web Development - Building Websites for All Devices."
      })} style={{cursor: "pointer"}}>
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 4 - Responsive Design</h4>
          <p>1:23:25 hrs</p>
        </div>
      </div>

    </div>

  </div>

  
  <footer>
    © 2026 Mentor Lab Platform | All Rights Reserved
  </footer>

        </div>
    )

}
export default RecordedLectures
