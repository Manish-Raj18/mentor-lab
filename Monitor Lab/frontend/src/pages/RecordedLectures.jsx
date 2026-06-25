import "../css_files/recorded.css";
function RecordedLectures(){
    return(
        <div className="abc">
        <div className="navbar1">
    <h1>DRONA GYAN</h1>

    <div className="nav-links">
      <a href="#">Home</a>
      <a href="#">Courses</a>
      <a href="#">Lectures</a>
    </div>
  </div>

  
  <div className="container">

    
    <div className="video-section">

      <video controls poster="C:\xampp\htdocs\xampp\900*500">
        <source src="/intro 2.mp4" type="video/mp4"/>
        Your browser does not support video.
      </video>

      <h2 className="lecture-title">
        Welcome To The Recorded Lectures.
      </h2>

      <p className="lecture-info">
        Instructor: Manish Raj • Duration: 5 mins • Uploaded: May 2026
      </p>

      <div className="description">
        <p>
          We Hope That Through The Help Of These Uploaded Lectures. You May Enhance Your Theoritical Knowledge.
        </p>
      </div>

    </div>

    
    <div className="sidebar">

      <h2>Course Playlist</h2>

      <div className="playlist-item">
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 1 - HTML Basics</h4>
          <p>32 mins</p>
        </div>
      </div>

      <div className="playlist-item">
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 2 - CSS Styling</h4>
          <p>40 mins</p>
        </div>
      </div>

      <div className="playlist-item">
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 3 - Flexbox & Grid</h4>
          <p>38 mins</p>
        </div>
      </div>

      <div className="playlist-item">
        <div className="thumbnail"></div>

        <div className="playlist-content">
          <h4>Lecture 4 - Responsive Design</h4>
          <p>50 mins</p>
        </div>
      </div>

    </div>

  </div>

  
  <footer>
    © 2026 Drona Gyan Platform | All Rights Reserved
  </footer>

        </div>
    )

}
export default RecordedLectures