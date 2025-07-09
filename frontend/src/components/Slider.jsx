import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaQuoteRight, FaUserCircle } from "react-icons/fa";




function SliderBar() {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1200,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    centerMode: true,
    centerPadding: "40px",
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        },
      },
    ],
  };

  const [FeedBackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch(`${backend_url}/api/feedback`);
        const data = await response.json();
        setFeedbackList(data);
      } catch (error) {
        alert("Error fetching feedback");
        console.error("Error fetching feedback:", error);
      }
    };
    init();
  }, []);

  return (
    <div className="slider-container max-w-6xl mx-auto my-12 px-2 border border-teal-400 bg-gradient-to-br from-teal-100 via-blue-300 to-purple-300 rounded-2xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-teal-600 mb-8 tracking-wide animate-fade-in">
        <span className="inline-block animate-spin">★</span> User Feedback <span className="inline-block animate-spin">★</span>
      </h2>
      <Slider {...settings}>
        {FeedBackList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400 mb-2"></span>
            <span className="text-teal-400 font-bold">Loading feedback...</span>
          </div>
        ) : (
          FeedBackList.map((feedback, idx) => (
            <div
              key={feedback.id || idx}
              className="slider-item border border-pink-400 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl shadow-xl p-8 mx-4 flex flex-col items-center justify-center min-h-[220px] animate-fade-in-up transition-transform duration-500 hover:scale-105"
            >
              <FaQuoteLeft className="text-3xl text-white mb-2 animate-pulse" />
              <p className="text-white text-lg italic text-center mb-4">{feedback.feedback}</p>
              <FaQuoteRight className="text-2xl text-white mb-2 self-end" />
              <div className="flex items-center gap-2 mt-4">
                <FaUserCircle className="text-2xl text-white" />
                <span className="text-white font-semibold text-sm">{feedback.name || feedback.email || "Anonymous"}</span>
              </div>
            </div>
          ))
        )}
      </Slider>
    </div>
  );
}

export default SliderBar;