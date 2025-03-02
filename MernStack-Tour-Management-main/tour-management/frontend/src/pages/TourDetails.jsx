import React, { useEffect, useState, useContext } from "react";
import "../styles/tour-details.css";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import { useParams } from "react-router-dom";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../components/Booking/Booking";
import Newsletter from "../shared/Newsletter";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import calculateAvgRating from "../utils/avgRating";
import { AuthContext } from "../context/AuthContext";

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // Fetch tour data
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  // Extract tour details
  const {
    photo,
    title,
    desc,
    price,
    address,
    reviews = [],
    city,
    distance,
    maxGroupSize,
  } = tour || {}; // Prevents crash if tour is undefined

  const { avgRating } = calculateAvgRating(reviews);

  
  const [reviewText, setReviewText] = useState("");
  const [tourRating, setTourRating] = useState(null);

  
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to submit a review.");
      return;
    }

    if (!reviewText.trim()) {
      alert("Review text cannot be empty.");
      return;
    }

    if (!tourRating) {
      alert("Please select a rating.");
      return;
    }

    const reviewObj = {
      username: user?.username,
      reviewText,
      rating: tourRating,
    };

    try {
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      console.log("Response Status:", res.status);
      console.log("Response Data:", result);

      if (!res.ok) {
        alert(`Failed to submit: ${result.message || "Unknown error"}`);
        return;
      }

      alert("Review submitted successfully!");
      setReviewText(""); 
      setTourRating(null); 
      window.location.reload(); 
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading.......</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && tour && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <img src={photo} alt={title} />

                  <div className="tour__info">
                    <h2>{title}</h2>
                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i className="ri-star-s-fill" style={{ color: "var(--secondary-color)" }}></i>
                        {reviews.length ? avgRating : "Not rated"}
                        {reviews.length > 0 && <span>({reviews.length})</span>}
                      </span>
                      <span>
                        <i className="ri-map-pin-user-fill"></i> {address}
                      </span>
                    </div>

                    <div className="tour__extra-details">
                      <span><i className="ri-map-pin-2-line"></i> {city}</span>
                      <span><i className="ri-money-dollar-circle-line"></i> ${price} / per person</span>
                      <span><i className="ri-map-pin-time-line"></i> {distance} km</span>
                      <span><i className="ri-group-line"></i> {maxGroupSize} people</span>
                    </div>

                    <h5>Description</h5>
                    <p>{desc}</p>
                  </div>

                  {/* ========== Reviews Section ========== */}
                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews.length} reviews)</h4>

                    <Form onSubmit={submitHandler}>
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <span
                            key={rating}
                            className={tourRating === rating ? "selected-rating" : ""}
                            onClick={() => setTourRating(rating)}
                            style={{ cursor: "pointer", fontWeight: tourRating === rating ? "bold" : "normal" }}
                          >
                            {rating} <i className="ri-star-s-fill"></i>
                          </span>
                        ))}
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your thoughts"
                          required
                        />
                        <button className="btn primary__btn text-white" type="submit">
                          Submit
                        </button>
                      </div>
                    </Form>

                    <ListGroup className="user__reviews">
                      {reviews.map((review, index) => (
                        <div className="review__item" key={index}>
                          <img src={avatar} alt="User Avatar" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.username}</h5>
                                <p>{new Date(review.date || review.createdAt).toLocaleDateString("en-US")}</p>
                              </div>
                              <span className="d-flex align-items-center">
                                {review.rating} <i className="ri-star-s-fill"></i>
                              </span>
                            </div>
                            <h6>{review.reviewText}</h6>
                          </div>
                        </div>
                      ))}
                    </ListGroup>
                  </div>
                </div>
              </Col>

              <Col lg="4">
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetails;
