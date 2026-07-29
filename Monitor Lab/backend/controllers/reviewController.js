import Review from "../model/review.js";

export const addReview = async (req, res) => {
  try {
    const { targetType, rating, review } = req.body;
    const user = req.user;

    const existing = await Review.findOne({ user: user._id, targetType });
    if (existing) {
      existing.rating = rating;
      existing.review = review;
      await existing.save();
      return res.status(200).json({ message: "Review updated", review: existing });
    }

    const newReview = await Review.create({
      user: user._id,
      userName: user.name,
      targetType,
      rating,
      review,
    });

    res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { targetType } = req.params;
    const reviews = await Review.find({ targetType })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
