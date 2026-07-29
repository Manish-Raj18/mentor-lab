import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css_files/review.css";

function ReviewSection({ targetType }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reviews/${targetType}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [targetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText.trim()) {
      setMessage("Please select a rating and write a review.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        { targetType, rating, review: reviewText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setRating(0);
      setReviewText("");
      const updated = await axios.get(`http://localhost:5000/api/reviews/${targetType}`);
      setReviews(updated.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-section">
      <h2 className="review-heading">Reviews & Ratings</h2>

      {!isLoggedIn && (
        <p className="review-login-msg">
          <Link to="/login">Log in</Link> to share your review and rating.
        </p>
      )}

      {isLoggedIn && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="star-rating">
            <p>Your Rating:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${(hover || rating) >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="review-textarea"
            rows="4"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button type="submit" className="review-submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          {message && <p className="review-msg">{message}</p>}
        </form>
      )}

      <div className="reviews-list">
        {loading && <p className="review-loading">Loading reviews...</p>}
        {!loading && reviews.length === 0 && (
          <p className="review-empty">No reviews yet. Be the first one!</p>
        )}
        {reviews.map((r) => (
          <div key={r._id} className="review-item">
            <div className="review-header">
              <span className="review-author">{r.userName}</span>
              <span className="review-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`review-star ${s <= r.rating ? "filled" : ""}`}>★</span>
                ))}
              </span>
              <span className="review-date">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="review-text">{r.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;
