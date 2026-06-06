/**
 * Reviews organised by destination slug.
 * "default" is used as a fallback for any slug not listed here.
 * Google review profile images: /assets/images/profiles/review*.png
 */

const googleReviews = [
  {
    img:    "/assets/images/profiles/review.png",
    name:   "Anuj Srivastava",
    date:   "Reviewed: a month ago",
    rating: "5.0/5",
    booked: "Andaman & Nicobar Islands – Honeymoon Package",
    text:   "We booked our honeymoon trip to the Andaman & Nicobar Islands with TourWatchOut, and it was an amazing experience! Everything was perfectly planned — from flights and hotels to local transfers and island activities. The team was professional, responsive, and made sure our trip was completely hassle-free. Special thanks to their local coordinators for smooth execution throughout. Thanks to TourWatchOut, we created beautiful memories that will last a lifetime. Highly recommended for a well-managed and memorable holiday!",
  },
  {
    img:    "/assets/images/profiles/review1.png",
    name:   "Atik Bijapure",
    date:   "Reviewed: a month ago",
    rating: "5.0/5",
    booked: "Goa Domestic Tour – 5 Days",
    text:   "We recently had an incredible 5-day domestic tour to Goa organised by Tourwatchout, and it was an absolutely memorable experience! As the Head of Agribusiness Management, I truly appreciate how well the team planned and executed every detail — perfectly combining educational exposure with fun and relaxation.",
  },
  {
    img:    "/assets/images/profiles/review2.png",
    name:   "Ashwani Kumar",
    date:   "Reviewed: a month ago",
    rating: "5.0/5",
    booked: "TourWatchOut Travel Package",
    text:   "Amazing experience! They were extremely dedicated and kept improving everything until it was perfect. Their patience, creativity, and commitment to quality made the entire process smooth and enjoyable.",
  },
  {
    img:    "/assets/images/profiles/review3.png",
    name:   "Uday",
    date:   "Reviewed: a month ago",
    rating: "5.0/5",
    booked: "Goa Tour Package",
    text:   "Our Goa trip organized by TourWatchOut was absolutely fantastic! Everything was perfectly planned — from the travel arrangements and hotel stays to sightseeing and activities. The team made sure we had a smooth and stress-free experience throughout the tour. Their coordination, punctuality, and attention to detail truly made our trip special. We didn't have to worry about a single thing — just enjoyed every moment! A big thank you to the TourWatchOut team for making our Goa tour so memorable. Highly recommended for anyone planning a fun, well-managed holiday!",
  },
  {
    img:    "/assets/images/profiles/review4.png",
    name:   "Aisha Yadav",
    date:   "Reviewed: a month ago",
    rating: "5.0/5",
    booked: "Goa College Group Trip",
    text:   "We recently went on our college trip to Goa with TourWatchOut, and it was an unforgettable experience! The whole tour was super well-organized — from travel to stay to all the fun activities. The team handled everything so smoothly and made sure we had the best time without any stress. The coordinators were really friendly, cooperative, and kept the vibe fun throughout the trip. Every moment was full of energy, laughter, and memories we'll always cherish. Big thanks to TourWatchOut for making our college trip so special! Highly recommend them for group and college tours!",
  },
  {
    img:    "/assets/images/profiles/review5.png",
    name:   "Mayuree Tawade",
    date:   "Reviewed: a month ago",
    rating: "5.0/5",
    booked: "Group Tour – 70 Students & Faculty",
    text:   "We came with a group of 70 students & 8 faculties. Excellent service, 5 Star rating always — much recommended. Smooth co-ordination. Thanks to Tourwatchout team.",
  },
  {
    img:    "/assets/images/profiles/review6.png",
    name:   "Arvind Sah",
    date:   "Reviewed: 3 months ago",
    rating: "5.0/5",
    booked: "Goa Travel & Cab Assistance",
    text:   "The service provided by Tourwatchout was amazing during our Goa visit. From booking our cab and helping us at each and every point whenever needed. We loved each and every moment of the trip and thanks Tourwatchout for such an amazing support.",
  },
  {
    img:    "/assets/images/profiles/review7.png",
    name:   "Chandan",
    date:   "Reviewed: 2 months ago",
    rating: "5.0/5",
    booked: "Thailand Family Tour",
    text:   "I with my family am very thankful to Mr Ivan and his entire team members including all persons involved. Your performance and total arrangements were excellent and not a single issue was created. I am very grateful to your team. My Thailand tour is a very sweet memory with this Tour & Travel team. With your team's co-operation: excellent. I will recommend my friends circle and relatives to prefer their tour with your Tour and Travel group. Thank you!",
  },
  {
    img:    "/assets/images/profiles/review8.png",
    name:   "Rakesh Kumar",
    date:   "Reviewed: 8 months ago",
    rating: "5.0/5",
    booked: "Shimla & Manali Honeymoon Package",
    text:   "Tourwatchout team has helped in making our honeymoon experience extraordinary with a pocket-friendly package for Shimla and Manali. The team was very cooperative and provided us a hassle-free experience. If you are looking to have a great experience please do consider Tourwatchout team.",
  },
  {
    img:    "/assets/images/profiles/review9.png",
    name:   "Yash Prakash",
    date:   "Reviewed: 3 months ago",
    rating: "5.0/5",
    booked: "TourWatchOut Travel Package",
    text:   "It was a good experience travelling with the assistance of Tourwatchout. They provided a nice stay, good food and smooth transitions. I took their service multiple times and they are consistent with the value they provide.",
  },
  {
    img:    "/assets/images/profiles/review10.png",
    name:   "Madhu Mourya",
    date:   "Reviewed: 8 months ago",
    rating: "5.0/5",
    booked: "Honeymoon Tour Package",
    text:   "Hi team, thanks for making our honeymoon extraordinary, with very nice hotel views and great guides. This is highly recommended.",
  },
];

export const destinationReviews = {
  kashmir: googleReviews,
  default: googleReviews,
};

/** Returns reviews for a given slug, falling back to "default". */
export function getReviewsBySlug(slug) {
  return destinationReviews[slug] || destinationReviews.default;
}
