import {Link} from "react-router-dom"
import "../css_files/notes.css";
function StudyNotes(){
    return(
        <div className="Show">
         <div class="heading">
        <h1><u>study notes</u> </h1>
     </div>

  <div class="card-container">
   
     
    <div class="card">
      <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D" alt="Card Image"/>

      <div className="card-content">
        <h2 className="card-title">BCA</h2>

     

       <Link to="/bca" className="card-btn">Click Here</Link>
      </div>
    </div>

    
    <div class="card">
      <img src="https://plus.unsplash.com/premium_photo-1664476845274-27c2dabdd7f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D" alt="Card Image"/>

      <div class="card-content">
        <h2 class="card-title">BBA</h2>
        <Link to="/bba" className="card-btn">Click Here</Link>
      </div>
    </div>

    
    <div class="card">
      <img src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpb3RlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D" alt="Card Image"/>

      <div class="card-content">
        <h2 class="card-title">BIOTECH</h2>
        <Link to="/biotechsylla" className="card-btn">Click Here</Link>
      </div>
    </div>

  </div>

        </div>
    )
}
export default StudyNotes